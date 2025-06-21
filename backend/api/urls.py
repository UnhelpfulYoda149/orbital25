from django.urls import path
from .views import place_order, portfolio_request, live_stock_request, check_username

urlpatterns = [
    path('place-order/', place_order, name='place-order'),
    path('portfolio-request/', portfolio_request, name='portfolio-request'),
    path('live-stock-request/', live_stock_request, name='live-stock-request'),
    path("api/user/check-username/", check_username, name="check_username"),
]
