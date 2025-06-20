from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, viewsets   
from .serializers import UserSerializer, StockSerializer, LiveStockSerializer, StockNamesSerializer, HistoryStockSerializer, PortfolioSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import LiveStock, HistoryStock, Transaction, Portfolio, Stock
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response


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

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def portfolio_request(request):
    user = request.user
    portfolio_ls = Portfolio.objects.filter(user=user)
    serializer = PortfolioSerializer(portfolio_ls, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def live_stock_request(request):
    symbol = request.data.get("symbol")
    stock = LiveStock.objects.get(symbol=symbol)
    serializer = LiveStockSerializer(stock)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def place_order(request):
    data = request.data
    user = request.user

    stock_symbol = data.get("stock")
    action = data.get("action")
    quantity = int(data.get("quantity")) #numStocks
    price = float(data.get("price"))

    # Get Stock model instance (not LiveStock)
    try:
        stock = Stock.objects.get(symbol=stock_symbol)
    except Stock.DoesNotExist:
        return Response({"error": f"Stock '{stock_symbol}' does not exist in Stock table."}, status=404)

    # Create Transaction
    Transaction.objects.create(
        user=user,
        stock=stock,
        action=action,
        quantity=quantity,
        price=price,
    )

    # Update Portfolio
    portfolio, created = Portfolio.objects.get_or_create(user=user, stock=stock, defaults={"quantity": 0, "average_price": 0}) # defaults are dummy values so as to avoid null errors on the backend
    if action == "buy":
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
        portfolio.quantity -= quantity
        if portfolio.quantity == 0:
            portfolio.delete()
        else:
            portfolio.save()

    return Response({'message': 'Order processed successfully'})