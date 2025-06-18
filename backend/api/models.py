from django.db import models

class Stock(models.Model):
    symbol = models.CharField(max_length=10)
    timestamp = models.DateTimeField()
    open = models.FloatField()
    high = models.FloatField()
    low = models.FloatField()
    close = models.FloatField()
    volume = models.BigIntegerField()

    class Meta:
        unique_together = ('symbol', 'timestamp')
        ordering = ['-timestamp']

    def __str__(self):
        return self.name