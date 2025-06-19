from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Stock, LiveStock, HistoryStock, StockNames


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

class StockNamesSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockNames
        fields = "__all__"