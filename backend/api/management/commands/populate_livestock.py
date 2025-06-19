'''
import os
import django

# Set the settings module (replace with your actual settings module path)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Setup Django
django.setup()

from api.models import Stock

# s = Stock(id="AAPL", name="Apple Inc", lastTradePrice=201.45, openPrice=204.39)
# s1 = Stock(id="AMD", name="Advanced Micro Devices Inc", lastTradePrice=121.73, openPrice=119.18)
# s2 = Stock(id="AMZN", name="Amazon.com Inc", lastTradePrice=216.98, openPrice=214.75)

# s.save()
# s1.save()
# s2.save()
all_objects = Stock.objects.all()
print(all_objects)
'''

import requests
from django.core.management.base import BaseCommand
from api.models import LiveStock
from django.utils import timezone

FINNHUB_API_KEY = "d0t6tapr01qid5qd4bb0d0t6tapr01qid5qd4bbg"
BASE_URL = "https://finnhub.io/api/v1"

# Example symbols to fetch
SYMBOLS = [  "AAPL",
  "GOOG",
  "MSFT",
  "NVDA",
  "AMZN",
  "TSLA",
  "META",
  "NFLX",
  "INTC",
  "AMD"]

class Command(BaseCommand):
    help = "Fetch and populate latest stock data into LiveStock model"

    def handle(self, *args, **kwargs):
        for symbol in SYMBOLS:
            try:
                # Fetch quote (latest price info)
                quote_url = f"{BASE_URL}/quote?symbol={symbol}&token={FINNHUB_API_KEY}"
                quote_res = requests.get(quote_url).json()

                # Fetch company profile (to get name)
                profile_url = f"{BASE_URL}/stock/profile2?symbol={symbol}&token={FINNHUB_API_KEY}"
                profile_res = requests.get(profile_url).json()

                LiveStock.objects.update_or_create(
                    symbol=symbol,
                    defaults={
                        "name": profile_res.get("name", "Unknown"),
                        "timestamp": timezone.now(),
                        "open": quote_res.get("o", 0.0),
                        "lastTrade": quote_res.get("c", 0.0),
                        "high": quote_res.get("h", 0.0),
                        "low": quote_res.get("l", 0.0),
                        "close": quote_res.get("pc", 0.0),
                        "volume": quote_res.get("v", 0),
                    },
                )

                self.stdout.write(self.style.SUCCESS(f"Updated {symbol}"))

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error fetching {symbol}: {e}"))

