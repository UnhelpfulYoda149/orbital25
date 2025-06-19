from django.db import models

class HistoryStock(models.Model):
    symbol = models.CharField(max_length=10)
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
    timestamp = models.DateTimeField()
    open = models.FloatField()
    lastTrade = models.FloatField()
    high = models.FloatField()
    low = models.FloatField()
    close = models.FloatField()
    volume = models.BigIntegerField()

    def __str__(self):
        return self.name

class StockNames(models.Model):
    symbol = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name

class Stock(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    name = models.CharField(max_length=255)
    lastTradePrice = models.FloatField()
    openPrice = models.FloatField()

    def __str__(self):
        return self.name