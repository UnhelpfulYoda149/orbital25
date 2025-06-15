from django.db import models

class Stock(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    name = models.CharField(max_length=255)
    lastTradePrice = models.FloatField()
    openPrice = models.FloatField()

    def __str__(self):
        return self.name