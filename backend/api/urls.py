from django.urls import path
from .views import place_order, portfolio_request, live_stock_request, check_username, get_transactions

urlpatterns = [
    path('place-order/', place_order, name='place-order'),
    path('portfolio-request/', portfolio_request, name='portfolio-request'),
    path('live-stock-request/', live_stock_request, name='live-stock-request'),
    path("user/check-username/", check_username, name="check_username"),
    path("user/transactions/", get_transactions, name="get_transactions"),
]
