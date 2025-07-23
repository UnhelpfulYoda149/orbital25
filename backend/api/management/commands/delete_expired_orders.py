from django.core.management.base import BaseCommand
from api.models import Order 

class Command(BaseCommand):
    help = "Deletes Day-Only orders after US-market closing"

    def handle(self, *args, **kwargs):
        expired_orders = Order.objects.filter(expiry=Order.DAY)
        count = expired_orders.count()
        expired_orders.delete()

        self.stdout.write(self.style.SUCCESS(f"Deleted {count} expired orders."))
