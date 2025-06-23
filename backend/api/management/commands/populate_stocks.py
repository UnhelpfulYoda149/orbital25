import time
import requests
from api.models import Stock

API_KEY = 'd0t6tapr01qid5qd4bb0d0t6tapr01qid5qd4bbg'

def get_tech_stocks(exchange="US"):
    # Step 1: Fetch all symbols
    url = f'https://finnhub.io/api/v1/stock/symbol?exchange={exchange}&token={API_KEY}'
    response = requests.get(url)
    symbols = response.json()

    for s in symbols:
        symbol = s['symbol']

        # Step 2: Get company profile (rate limit: 30/sec)
        profile_url = f'https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token={API_KEY}'
        r = requests.get(profile_url)
        if r.status_code != 200:
            continue

        profile = r.json()
        sector = profile.get('finnhubIndustry') or profile.get('sector')

        if sector and "Technology" in sector:
            Stock.objects.get_or_create(
                symbol=symbol,
                defaults={'name': profile.get('name', symbol)}
            )

        time.sleep(0.04)  # 25 calls/sec for safety
