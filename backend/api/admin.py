from django.contrib import admin

# Register your models here.
from .models import Stock, LiveStock, HistoryStock, StockNames

admin.site.register(Stock)
admin.site.register(LiveStock)
admin.site.register(HistoryStock)
admin.site.register(StockNames)