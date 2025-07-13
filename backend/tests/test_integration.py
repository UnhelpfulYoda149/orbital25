from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import *

class TradingIntegrationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="alice", password="Password@123")
        self.client.login(username="alice", password="Password@123")
        self.stock = Stock.objects.create(symbol="AAPL", name="Apple Inc.")
        self.client.force_authenticate(user=self.user)

    def test_market_order_flow(self):
        # Place market order
        response = self.client.post('/place-order/', {
            "stock": "AAPL",
            "quantity": 1,
            "action": "buy",
            "instruction": "market",
            "price": 1.00,
            "expiry": "gtc"
        })
        self.assertEqual(response.status_code, 200)

        # Verify transaction recorded
        tx = self.client.get("/user/transactions/")
        self.assertEqual(len(tx.data), 1)

        # Check portfolio
        pf = self.client.get("/portfolio-request/")
        self.assertTrue(any(item['stock'] == 'AAPL' for item in pf.data))

        # Check post
        posts = self.client.get(f"/user/{self.user.username}/posts/")
        print(posts.data)
        self.assertTrue(any(post["transaction"]["stock_symbol"] == "AAPL" for post in posts.data)) 
