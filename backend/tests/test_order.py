from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from api.models import Stock, UserProfile

class OrderTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="buyer", password="Password@123")
        self.client.force_authenticate(user=self.user)
        self.stock = Stock.objects.create(symbol="AAPL", name="Apple Inc.")
        UserProfile.objects.get_or_create(user=self.user)

    def test_market_buy_order(self):
        response = self.client.post('/place-order/', {
            "symbol": "AAPL",
            "quantity": 1,
            "price": 150,
            "action": "buy",
            "order_type": "market"
        }, format='json')
        self.assertEqual(response.status_code, 200)

    def test_limit_buy_order(self):
        response = self.client.post('/place-order/', {
            "symbol": "AAPL",
            "quantity": 2,
            "price": 150,
            "order_type": "limit",
            "action": "buy"
        }, format='json')
        self.assertEqual(response.status_code, 200)

    def test_invalid_order_quantity(self):
        response = self.client.post('/place-order/', {
            "symbol": "AAPL",
            "quantity": -10,
            "order_type": "market",
            "action": "buy"
        }, format='json')
        self.assertEqual(response.status_code, 400)
