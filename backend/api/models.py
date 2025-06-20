from django.db import models
from django.contrib.auth.models import User

class Stock(models.Model):
    symbol = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    
class HistoryStock(models.Model):
    symbol = models.CharField(max_length=10)
    name = models.CharField(max_length=255)
    timestamp = models.DateTimeField()
    open = models.FloatField()
    lastTrade = models.FloatField()
    high = models.FloatField()
    low = models.FloatField()
    close = models.FloatField()
    volume = models.BigIntegerField()

    class Meta:
        unique_together = ('symbol', 'timestamp')
        ordering = ['-timestamp']

    def __str__(self):
        return self.name
    

class LiveStock(models.Model):
    symbol = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=255)
    timestamp = models.DateTimeField()
    open = models.FloatField()
    lastTrade = models.FloatField()
    high = models.FloatField()
    low = models.FloatField()
    close = models.FloatField()
    volume = models.BigIntegerField()

    def __str__(self):
        return self.name

class Transaction(models.Model):
    BUY = 'buy'
    SELL = 'sell'
    ACTIONS = [
        (BUY, 'Buy'),
        (SELL, 'Sell'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    action = models.CharField(max_length=4, choices=ACTIONS)
    quantity = models.PositiveIntegerField()
    price = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)
    realized_pnl = models.FloatField(null=True, blank=True)  # optional

    def __str__(self):
        return f"{self.user.username} {self.action} {self.quantity} {self.stock}"


class Portfolio(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    average_price = models.FloatField()

    class Meta:
        unique_together = ("user", "stock")

    def __str__(self):
        return f"{self.user.username} - {self.stock}: {self.quantity} @ {self.average_price}"
    

class StockNames(models.Model):
    symbol = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name


