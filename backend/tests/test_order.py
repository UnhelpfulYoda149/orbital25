from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from api.models import Stock, UserProfile

class OrderTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="buyer", password="Password@123")
        self.client.force_authenticate(user=self.user)
        self.stock = Stock.objects.create(symbol="AAPL", name="Apple Inc.")

    def test_market_buy_order(self):
        response = self.client.post('/place-order/', {
            "stock": "AAPL",
            "quantity": 1,
            "price": 150,
            "action": "buy",
            "instruction": "market",
            "expiry": "gtc"
        }, format='json')
        self.assertEqual(response.status_code, 200)

    def test_limit_buy_order(self):
        response = self.client.post('/place-order/', {
            "stock": "AAPL",
            "quantity": 2,
            "price": 150,
            "instruction": "limit",
            "action": "buy",
            "expiry": "day"
        }, format='json')
        self.assertEqual(response.status_code, 200)

    def test_invalid_order_quantity(self):
        response = self.client.post('/place-order/', {
            "stock": "AAPL",
            "quantity": -10,
            "instruction": "market",
            "action": "buy",
            "expiry": "gtc",
            "price": 1.00
        }, format='json')
        self.assertEqual(response.status_code, 400)
