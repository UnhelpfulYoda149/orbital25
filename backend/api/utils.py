from .models import Portfolio, LiveStock, Order, UserProfile
from django.contrib.auth.models import User

def calculate_portfolio_value(user: User):
    total_value = 0
    stock_holdings = 0

    # Portfolio (stock holdings)
    portfolio_items = Portfolio.objects.filter(user=user)
    for item in portfolio_items:
        try:
            live_stock = LiveStock.objects.get(symbol=item.stock.symbol)
            total_value += live_stock.lastTrade * item.quantity
        except LiveStock.DoesNotExist:
            continue

    stock_holdings = total_value

    # Cash from user profile
    try:
        user_profile = UserProfile.objects.get(user=user)
        total_value += user_profile.money
    except UserProfile.DoesNotExist:
        pass

    # Reserved cash from pending buy orders
    pending_buy_orders = Order.objects.filter(user=user, action="buy")
    reserved_cash = sum(order.price * order.quantity for order in pending_buy_orders)
    total_value += reserved_cash

    return [total_value, stock_holdings]
