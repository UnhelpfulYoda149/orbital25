from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, viewsets   
from .serializers import UserSerializer, StockSerializer, LiveStockSerializer, StockNamesSerializer, HistoryStockSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Stock, LiveStock, HistoryStock, StockNames

# Create your views here

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    permission_classes = [AllowAny]

class LiveStockViewSet(viewsets.ModelViewSet):
    queryset = LiveStock.objects.all()
    serializer_class = LiveStockSerializer
    permission_classes = [AllowAny]

class HistoryStockViewSet(viewsets.ModelViewSet):
    queryset = HistoryStock.objects.all()
    serializer_class = HistoryStockSerializer
    permission_classes = [AllowAny]

class StockNamesViewSet(viewsets.ModelViewSet):
    queryset = StockNames.objects.all()
    serializer_class = StockNamesSerializer
    permission_classes = [AllowAny]