from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import *

class TradingIntegrationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="alice", password="Password@123")
        self.client.login(username="alice", password="Password@123")
        self.stock = Stock.objects.create(symbol="AAPL", name="Apple Inc.")
        UserProfile.objects.create(user=self.user, money=5000)

    def test_market_order_flow(self):
        # Place market order
        self.client.post('/order/', {
            "symbol": "AAPL",
            "quantity": 1,
            "action": "buy",
            "order_type": "market"
        })
        # Verify transaction recorded
        tx = self.client.get("/transactions/")
        self.assertEqual(len(tx.data), 1)
        # Check portfolio
        pf = self.client.get("/portfolio/")
        self.assertTrue(any(item['stock'] == 'AAPL' for item in pf.data))
        # Check post
        posts = self.client.get("/posts/")
        self.assertTrue(any("AAPL" in post['content'] for post in posts.data))
