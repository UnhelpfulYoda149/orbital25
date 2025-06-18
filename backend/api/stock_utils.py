import requests
from django.utils import timezone
from .models import Stock
from django.conf import settings

def fetch_and_store_stock_data(symbol):
    url = f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={settings.FINNHUB_API_KEY}"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        Stock.objects.create(
            symbol=symbol,
            timestamp=timezone.now(),
            open=data.get("o"),
            high=data.get("h"),
            low=data.get("l"),
            close=data.get("c"),
            volume=0  # If you don’t get volume data, keep 0
        )
    else:
        print(f"Error fetching data for {symbol}: {response.status_code}")