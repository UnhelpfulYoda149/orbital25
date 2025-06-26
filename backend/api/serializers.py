from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *


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
        fields = ["id", "user", "money", "bio"]

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
    comments_count = serializers.IntegerField(source="comments.count", read_only=True)
    likes_count = serializers.IntegerField(source="likes.count", read_only=True)

    class Meta:
        model = Post
        fields = ["id", "user", "transaction", "timestamp", "comments_count", "likes_count"]

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "user", "text", "timestamp"]

class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Like
        fields = ["id", "user", "post", "timestamp"]

class PublicProfileSerializer(serializers.Serializer):
    username = serializers.CharField()
    bio = serializers.CharField()
    num_friends = serializers.IntegerField()
    num_posts = serializers.IntegerField()
    is_friend = serializers.BooleanField()

class OrderSerializer(serializers.ModelSerializer):
    stock = StockSerializer(read_only=True)
    class Meta:
        model = Order
        fields = ["id", "user", "stock", "action", "expiry", "quantity", "price", "timestamp"]