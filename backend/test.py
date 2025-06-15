import os
import django

# Set the settings module (replace with your actual settings module path)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Setup Django
django.setup()

from api.models import Stock

s = Stock(id="AAPL", name="Apple Inc", lastTradePrice=201.45, openPrice=204.39)

s.save()
all_objects = Stock.objects.all()
print(all_objects)