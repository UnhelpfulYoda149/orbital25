"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, LiveStockViewSet, HistoryStockViewSet, place_order, portfolio_request, live_stock_request, check_username, get_transactions, get_watchlist, toggle_watchlist, search_stock, get_money, search_user, toggle_friend_request, get_sent_requests, get_received_requests, reject_friend_request, accept_friend_request, get_friends, remove_friend, get_friend_data
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"liveStock", LiveStockViewSet, basename="liveStock")
router.register(r"historyStock", HistoryStockViewSet, basename="historyStock")

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth", include("rest_framework.urls")),
    path("", include(router.urls)),
    path('place-order/', place_order, name='place-order'),
    path('portfolio-request/', portfolio_request, name='portfolio-request'),
    path('live-stock-request/', live_stock_request, name='live-stock-request'),
    path("user/check-username/", check_username, name="check_username"),
    path("user/friends/", get_friends, name="get_friends"),
    path("user/transactions/", get_transactions, name="get_transactions"),
    path("user/watchlist/", get_watchlist, name="get_watchlist"),
    path("user/watchlist/toggle/", toggle_watchlist, name="toggle_watchlist"),
    path("user/money/", get_money, name="get_money"),
    path("user/received-requests/", get_received_requests, name="get_received_requests"),
    path("user/sent-requests/", get_sent_requests, name="get_sent_requests"),
    path("search-stock/", search_stock, name="search_stock"),
    path("search-user/", search_user, name="search_user"),
    path("toggle-friend-request/", toggle_friend_request, name="toggle_friend_request"),
    path("accept-friend-request/", accept_friend_request, name="accept_friend_request"),
    path("reject-friend-request/", reject_friend_request, name="reject_friend_request"),
    path("remove-friend/", remove_friend, name="remove_friend"),
    path("get-friend-data/", get_friend_data, name="get_friend_data"),
]