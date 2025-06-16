from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, viewsets   
from .serializers import UserSerializer, StockSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Stock

# Create your views here

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    permission_classes = [AllowAny]