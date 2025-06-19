from django.db import models

# class Stock(models.Model):
#     symbol = models.CharField(max_length=10, primary_key=True)
#     timestamp = models.DateTimeField()
#     open = models.FloatField()
#     high = models.FloatField()
#     low = models.FloatField()
#     close = models.FloatField()
#     volume = models.BigIntegerField()

#     class Meta:
#         unique_together = ('symbol', 'timestamp')
#         ordering = ['-timestamp']

#     def __str__(self):
#         return self.name

class Stock(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    name = models.CharField(max_length=255)
    lastTradePrice = models.FloatField()
    openPrice = models.FloatField()

    def __str__(self):
        return self.name