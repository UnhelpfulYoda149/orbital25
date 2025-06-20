from django.contrib import admin

# Register your models here.
from .models import LiveStock, HistoryStock, Transaction, Portfolio, Stock

admin.site.register(Stock)
admin.site.register(LiveStock)
admin.site.register(HistoryStock)
admin.site.register(Transaction)
admin.site.register(Portfolio)
