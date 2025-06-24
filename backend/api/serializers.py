from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Stock, LiveStock, HistoryStock, Portfolio, Transaction, Watchlist, UserProfile, FriendRequest, Friend, Post


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = "__all__"

class LiveStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiveStock
        fields = "__all__"

class HistoryStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryStock
        fields = "__all__"

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = "__all__"

class TransactionSerializer(serializers.ModelSerializer):
    stock_name = serializers.CharField(source="stock.name", read_only=True)
    stock_symbol = serializers.CharField(source="stock.symbol", read_only=True)

    class Meta:
        model = Transaction
        fields = ["id", "action", "quantity", "price", "timestamp", "realized_pnl", "stock_name", "stock_symbol"]

class WatchlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Watchlist
        fields = "__all__"

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ["id", "user", "money"]

class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = "__all__"

class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = "__all__"

class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    transaction = TransactionSerializer(read_only=True)

    class Meta:
        model = Post
        fields = ["id", "user", "transaction", "timestamp"]