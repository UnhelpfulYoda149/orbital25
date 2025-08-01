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
from api.views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"liveStock", LiveStockViewSet, basename="liveStock")
router.register(r"historyStock", HistoryStockViewSet, basename="historyStock")

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/cleanup-orders/", cleanup_orders, name="cleanup_orders"),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="login"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth", include("rest_framework.urls")),
    path("", include(router.urls)),
    path('place-order/', place_order, name='place-order'),
    path('portfolio-request/', portfolio_request, name='portfolio-request'),
    path("user/<str:username>/portfolio/", portfolio_request),
    path('live-stock-request/', live_stock_request, name='live-stock-request'),
    path("live-stock-batch/", get_multiple_stock_prices, name="live_stock_batch"),
    path("user/cancel-order/", cancel_order, name="cancel_order"),
    path("user/check-username/", check_username, name="check_username"),
    path("user/feed/", get_feed, name="get_feed"),
    path("user/friends/", get_friends, name="get_friends"),
    path("user/pending-orders/", get_orders, name="get_orders"),
    path("user/<str:username>/pending-orders/", get_user_pending_orders),
    path("user/transactions/", get_transactions, name="get_transactions"),
    path("user/watchlist/", get_watchlist, name="get_watchlist"),
    path("user/watchlist/toggle/", toggle_watchlist, name="toggle_watchlist"),
    path("user/money/", get_money, name="get_money"),
    path("user/<str:username>/money/", get_money, name="get_money"),
    path("user/received-requests/", get_received_requests, name="get_received_requests"),
    path("user/sent-requests/", get_sent_requests, name="get_sent_requests"),
    path("user/post-comment/", post_comment, name="post_comment"),
    path("search-stock/", search_stock, name="search_stock"),
    path("search-user/", search_user, name="search_user"),
    # path("search-post/", get_post, name="search_post"),
    path("toggle-friend-request/", toggle_friend_request, name="toggle_friend_request"),
    path("toggle-post-like/", toggle_like, name="toggle_post_like"),
    path("accept-friend-request/", accept_friend_request, name="accept_friend_request"),
    path("reject-friend-request/", reject_friend_request, name="reject_friend_request"),
    path("remove-friend/", remove_friend, name="remove_friend"),
    path("get-friend-data/", get_friend_data, name="get_friend_data"),
    path("user/<str:username>/profile/", get_user_profile),
    path("user/<str:username>/posts/", get_user_posts),
    path("user/update-bio/", update_bio),
    path("leaderboard/global/", global_leaderboard),
    path("leaderboard/local/", local_leaderboard),
    
]