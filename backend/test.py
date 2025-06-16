import os
import django

# Set the settings module (replace with your actual settings module path)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Setup Django
django.setup()

from api.models import Stock

s = Stock(id="AAPL", name="Apple Inc", lastTradePrice=201.45, openPrice=204.39)
s1 = Stock(id="AMD", name="Advanced Micro Devices Inc", lastTradePrice=121.73, openPrice=119.18)
s2 = Stock(id="AMZN", name="Amazon.com Inc", lastTradePrice=216.98, openPrice=214.75)

# s.save()
# s1.save()
# s2.save()
all_objects = Stock.objects.all()
print(all_objects)