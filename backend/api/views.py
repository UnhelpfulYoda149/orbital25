from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, viewsets, status  
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
import requests
from django.conf import settings
import os


# Create your views here

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class LiveStockViewSet(viewsets.ModelViewSet):
    queryset = LiveStock.objects.all()
    serializer_class = LiveStockSerializer
    permission_classes = [AllowAny]

class HistoryStockViewSet(viewsets.ModelViewSet):
    queryset = HistoryStock.objects.all()
    serializer_class = HistoryStockSerializer
    permission_classes = [AllowAny]

from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Portfolio
from .serializers import PortfolioSerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def portfolio_request(request):
    from django.contrib.auth.models import User

    # Check for ?user=username in query string
    username = request.GET.get("user", None)

    try:
        if username:
            user = User.objects.get(username=username)
        else:
            user = request.user

        portfolio_items = Portfolio.objects.filter(user=user)
        serializer = PortfolioSerializer(portfolio_items, many=True)
        return Response(serializer.data)

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)


FINNHUB_API_KEY = os.getenv("REACT_APP_FINNHUB_KEY")

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def live_stock_request(request):
    symbol = request.data.get("symbol")

    # Step 1: Fetch from Finnhub
    finnhub_url = f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={FINNHUB_API_KEY}"
    finnhub_res = requests.get(finnhub_url)

    if finnhub_res.status_code != 200:
        return Response({"error": "Failed to fetch from Finnhub."}, status=500)

    finnhub_data = finnhub_res.json()
    last_price = finnhub_data.get("c")

    if last_price is None:
        return Response({"error": "Invalid data from Finnhub."}, status=500)

    print(f"[live_stock_request] Updating {symbol}: {last_price}")

    # Step 2: Update or create
    stock, created = LiveStock.objects.get_or_create(symbol=symbol)
    stock.lastTrade = last_price
    stock.save()

    s = Stock.objects.get(symbol=stock.symbol)
    orders_list = Order.objects.filter(stock=s)
    for order in orders_list:
        #If stock price is lower than price user is willing to buy at
        if order.action == "buy" and order.price >= stock.lastTrade:
            #Transaction occurs
            transaction = Transaction.objects.create(
                user=order.user,
                stock=s,
                action=order.action,
                quantity=order.quantity,
                price=stock.lastTrade,
            )

            # Create Post
            post = Post.objects.create(user=order.user, transaction=transaction)

            portfolio, created = Portfolio.objects.get_or_create(user=order.user, stock=s, defaults={"quantity": 0, "average_price": 0}) # defaults are dummy values so as to avoid null errors on the backend

            #Refund user the diff between order and transaction
            user_profile = UserProfile.objects.get(user=order.user)
            user_profile.money += order.quantity * (order.price - stock.lastTrade)
            user_profile.save()

            if created:
                portfolio.quantity = order.quantity
                portfolio.average_price = stock.lastTrade
            else:
                total_shares = portfolio.quantity + order.quantity
                portfolio.average_price = (
                    (portfolio.average_price * portfolio.quantity + stock.lastTrade * order.quantity) / total_shares
                )
                portfolio.quantity = total_shares
            portfolio.save()
            order.delete()

        if order.action == "sell" and order.price <= stock.lastTrade:
            #Transaction occurs
            transaction = Transaction.objects.create(
                user=order.user,
                stock=s,
                action=order.action,
                quantity=order.quantity,
                price=stock.lastTrade,
            )

            # Create Post
            post = Post.objects.create(user=order.user, transaction=transaction)

            portfolio, created = Portfolio.objects.get_or_create(user=order.user, stock=s, defaults={"quantity": 0, "average_price": 0}) # defaults are dummy values so as to avoid null errors on the backend

            if order.quantity < portfolio.quantity:
                user_profile = UserProfile.objects.get(user=order.user)
                user_profile.money += stock.lastTrade * order.quantity
                user_profile.save()

                portfolio.quantity -= order.quantity

                if portfolio.quantity == 0:
                    portfolio.delete()
                else:
                    portfolio.save()
            order.delete()

    serializer = LiveStockSerializer(stock)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_multiple_stock_prices(request):
    symbols = request.data.get("symbols", [])
    if not isinstance(symbols, list):
        return Response({"error": "Symbols must be a list."}, status=400)

    stocks = LiveStock.objects.filter(symbol__in=symbols)
    data = [
        {
            "symbol": stock.symbol,
            "name": stock.name,
            "lastTrade": stock.lastTrade,
            "open": stock.open,
            "high": stock.high,
            "low": stock.low,
            "close": stock.close,
            "volume": stock.volume,
        }
        for stock in stocks
    ]
    return Response(data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def place_order(request):
    data = request.data
    user = request.user

    stock_symbol = data.get("stock")
    action = data.get("action")
    quantity = int(data.get("quantity")) #numStocks
    price = float(data.get("price"))
    instruction = data.get("instruction")
    expiry = data.get("expiry")
    user_profile = UserProfile.objects.get(user=user)

    # Get Stock model instance (not LiveStock)
    try:
        stock = Stock.objects.get(symbol=stock_symbol)
    except Stock.DoesNotExist:
        return Response({"error": f"Stock '{stock_symbol}' does not exist in Stock table."}, status=404)

    if instruction == "limit":
        order = Order.objects.create(
            user=user,
            stock=stock,
            action=action,
            expiry=expiry,
            quantity=quantity,
            price=price
        )
        if action == "buy":
            user_profile.money -= price * quantity
            user_profile.save()

        return Response({"message": "Order submitted"})
    else:
        # Create Transaction
        transaction = Transaction.objects.create(
            user=user,
            stock=stock,
            action=action,
            quantity=quantity,
            price=price,
        )

        # Create Post
        post = Post.objects.create(user=user, transaction=transaction)

        # Update Portfolio
        portfolio, created = Portfolio.objects.get_or_create(user=user, stock=stock, defaults={"quantity": 0, "average_price": 0}) # defaults are dummy values so as to avoid null errors on the backend

        if action == "buy":
            user_profile.money -= price * quantity
            user_profile.save()
            if created:
                portfolio.quantity = quantity
                portfolio.average_price = price
            else:
                total_shares = portfolio.quantity + quantity
                portfolio.average_price = (
                    (portfolio.average_price * portfolio.quantity + price * quantity) / total_shares
                )
                portfolio.quantity = total_shares
            portfolio.save()

        elif action == "sell":
            if quantity > portfolio.quantity:
                return Response({"error": "Not enough shares to sell."}, status=400)
            user_profile.money += price * quantity
            user_profile.save()
            portfolio.quantity -= quantity
            if portfolio.quantity == 0:
                portfolio.delete()
            else:
                portfolio.save()

        return Response({'message': 'Order processed successfully'})
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_orders(request):
    user = request.user

    order_list = Order.objects.filter(user=user).order_by('-timestamp')
    serializer = OrderSerializer(order_list, many=True)

    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_pending_orders(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)

    orders = Order.objects.filter(user=user, action="buy")  # optionally: .filter(status="pending")
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_order(request):
    user = request.user
    order_id = request.data.get("id")

    order_obj = Order.objects.get(id=order_id, user=user)

    if order_obj.action == "buy":
        user_profile = UserProfile.objects.get(user=user)
        user_profile.money += order_obj.price * order_obj.quantity
        user_profile.save()

    order_obj.delete()

    return Response({"Status" : "deleted"})

# Username check
@api_view(["GET"])
def check_username(request):
    username = request.GET.get("username")
    exists = User.objects.filter(username=username).exists()
    return Response({"exists": exists})

# Retrieve Transaction History
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_transactions(request):
    user = request.user
    transactions = Transaction.objects.filter(user=user).order_by('-timestamp')
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_watchlist(request):
    user = request.user
    watchlist = Watchlist.objects.filter(user=user)
    serializer = WatchlistSerializer(watchlist, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_watchlist(request):
    user = request.user
    symbol = request.data.get("symbol")

    try:
        stock = Stock.objects.get(symbol=symbol)
    except Stock.DoesNotExist:
        return Response({"error": "Stock not found"}, status=404)

    watchlist_item, created = Watchlist.objects.get_or_create(user=user, stock=stock)
    if not created:
        watchlist_item.delete()
        return Response({"status": "removed"})
    return Response({"status": "added"})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_stock(request):
    query = request.GET.get("query", "").upper()
    if not query:
        return Response([])

    matches = Stock.objects.filter(
        Q(symbol__icontains=query) | Q(name__icontains=query)
    )

    # If not found in DB, fetch from external API and save
    if not matches.exists():
        # Call your external stock API (e.g. Finnhub)
        # For example:
        # external_data = call_api(query)
        # if external_data:
        #     stock = Stock.objects.create(**external_data)
        #     matches = [stock]
        pass  # implement external fetch logic

    serializer = StockSerializer(matches, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_money(request, username=None):
    try:
        if username:
            user = User.objects.get(username=username)
        else:
            user = request.user

        user_profile = UserProfile.objects.get(user=user)
        return Response({"money": user_profile.money})

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except UserProfile.DoesNotExist:
        return Response({"error": "UserProfile not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_user(request):
    user = request.user
    query = request.GET.get("query", "").upper()
    if not query:
        return Response([])

    matches = User.objects.filter(Q(username__icontains=query)).exclude(username=user.username)

    serializer = UserSerializer(matches, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_friend_request(request):
    user = request.user
    data = request.data.get("username")
    target = User.objects.get(username=data)

    result = FriendRequest.objects.filter(from_user=user, to_user=target)

    if not result:
        FriendRequest.objects.create(from_user=user, to_user=target)
    else:
        result.delete()

    return Response({"status": "request successful"})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def accept_friend_request(request):
    user = request.user
    data = request.data.get("username")
    target = User.objects.get(username=data)

    #Create Friend row between 2 users
    Friend.objects.create(user1=user, user2=target)

    #Remove friend requests from FriendRequest table
    result = FriendRequest.objects.filter(from_user=target, to_user=user)
    if result:
        result.delete()

    result2 = FriendRequest.objects.filter(from_user=user, to_user=target)
    if result2:
        result2.delete()

    return Response({"status": "accept successful"})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def reject_friend_request(request):
    user = request.user
    data = request.data.get("username")
    target = User.objects.get(username=data)

    #Remove FriendRequest from FriendRequest Table
    result = FriendRequest.objects.filter(from_user=target, to_user=user)
    result.delete()

    return Response({"status": "reject successful"})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def remove_friend(request):
    user = request.user
    data = request.data.get("username")
    target = User.objects.get(username=data)

    #Remove FriendRequest from FriendRequest Table
    result = Friend.objects.filter(user1=user, user2=target)
    if result:
        result.delete()
    else:
        Friend.objects.filter(user1=target, user2=user).delete()

    return Response({"status": "remove successful"})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_sent_requests(request):
    user = request.user

    requests_list = FriendRequest.objects.filter(from_user=user)
    res = [req.to_user.username for req in requests_list]

    return Response(res)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_received_requests(request):
    user = request.user

    requests_list = FriendRequest.objects.filter(to_user=user)
    res = [req.from_user.username for req in requests_list]

    return Response(res)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_friends(request):
    user = request.user

    friends_list = Friend.objects.filter(Q(user1=user) | Q(user2=user))
    friends = [pair.user1 if pair.user2 == user else pair.user2 for pair in friends_list]
    res = [user.username for user in friends]

    return Response(res)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_friend_data(request):
    user = request.user
    friend_username = request.data.get("username")
    friend = User.objects.get(username=friend_username)

    friend_money = UserProfile.objects.get(user=friend).money
    friend_portfolio = Portfolio.objects.filter(user=friend)
    for item in friend_portfolio:
        friend_money += item.quantity * LiveStock.objects.get(symbol=item.stock.symbol).lastTrade

    return Response({"portfolio_value": friend_money})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_feed(request):
    user = request.user
    friends_list = Friend.objects.filter(Q(user1=user) | Q(user2=user))
    friends = [pair.user1 if pair.user2 == user else pair.user2 for pair in friends_list]

    friend_posts = Post.objects.filter(user__in=friends)[:20]
    serializer = PostSerializer(friend_posts, many=True)
    post_data = serializer.data

    for post in post_data:
        post_obj = Post.objects.get(id=post["id"])
        comments = Comment.objects.filter(post=post_obj)
        serializer = CommentSerializer(comments, many=True)
        
        post["isLiked"] = Like.objects.filter(user=user, post=post_obj).exists()
        post["comments"] = serializer.data

    return Response(post_data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def post_comment(request):
    user = request.user
    comment = request.data.get("comment")
    post_id = request.data.get("id")
    post_obj = Post.objects.get(id=post_id)

    Comment.objects.create(user=user, text=comment, post=post_obj)

    return Response({"status": "commented"})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_like(request):
    user = request.user
    post_id = request.data.get("id")
    post_obj = Post.objects.get(id=post_id)

    try:
        Like.objects.get(user=user, post=post_obj).delete()
    except Like.DoesNotExist:
        Like.objects.create(user=user, post=post_obj)

    return Response({"status": "toggled"})

# Returns the user's post only if the requester is a friend. Otherwise, return a permission error
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_posts(request, username):
    user = request.user
    try:
        target_user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    requester = request.user
    is_friend = Friend.objects.filter(
        Q(user1=requester, user2=target_user) | Q(user1=target_user, user2=requester)
    ).exists()

    if not is_friend and requester != target_user:
        return Response([])

    posts = Post.objects.filter(user=target_user)
    serializer = PostSerializer(posts, many=True)
    post_data = serializer.data

    for post in post_data:
        post_obj = Post.objects.get(id=post["id"])
        comments = Comment.objects.filter(post=post_obj)
        serializer = CommentSerializer(comments, many=True)

        post["isLiked"] = Like.objects.filter(user=user, post=post_obj).exists()
        post["comments"] = serializer.data

    return Response(post_data)


# Allow logged-in user to edit their bio.
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_bio(request):
    bio = request.data.get("bio", "")
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    profile.bio = bio
    profile.save()
    return Response({"success": True})
    
# Returns profile info, friend count, post count and a flag indicating whether the requester is a friend.
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_profile(request, username):
    try:
        target_user = User.objects.get(username=username)
        profile = UserProfile.objects.get(user=target_user)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except UserProfile.DoesNotExist:
        return Response({"error": "User profile not found"}, status=404)

    # Check if requester is friend
    requester = request.user
    is_friend = Friend.objects.filter(
        Q(user1=requester, user2=target_user) | Q(user1=target_user, user2=requester)
    ).exists()

    # Post count
    post_count = Post.objects.filter(user=target_user).count()

    # Friend count
    friend_count = Friend.objects.filter(Q(user1=target_user) | Q(user2=target_user)).count()

    data = {
        "username": target_user.username,
        "bio": profile.bio if hasattr(profile, "bio") else "",
        "post_count": post_count,
        "friend_count": friend_count,
        "is_friend": is_friend,
    }

    return Response(data)