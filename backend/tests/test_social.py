from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from api.models import FriendRequest, Post, Comment, Like, Transaction, Stock
from api.models import UserProfile

class SocialFeaturesTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='Password@123')
        self.user2 = User.objects.create_user(username='user2', password='Password@123')
        # Authenticate user1    
        res = self.client.post("/api/token/", {"username": "user1", "password": "Password@123"})
        self.token = res.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + self.token)

    def test_search_user(self):
        response = self.client.get("/search-user/?query=user2")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(any(u["username"] == "user2" for u in response.data))

    def test_send_and_cancel_friend_request(self):
        # Send request
        response = self.client.post("/toggle-friend-request/", {"username": "user2"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("status", response.data)

        # Cancel request
        response = self.client.post("/toggle-friend-request/", {"username": "user2"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "request successful")

    def test_accept_and_remove_friend(self):
        # Send from user1
        self.client.post("/toggle-friend-request/", {"username": "user2"})

        # Switch to user2 and accept
        res = self.client.post("/api/token/", {"username": "user2", "password": "Password@123"})
        token2 = res.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + token2)

        response = self.client.post("/accept-friend-request/", {"username": "user1"})
        self.assertEqual(response.status_code, 200)

        # Remove friend
        response = self.client.post("/remove-friend/", {"username": "user1"})
        self.assertEqual(response.status_code, 200)

    def test_like_and_unlike_post(self):
        # Create a stock first
        stock = Stock.objects.create(symbol="AAPL", name="Apple Inc.")

        # Create a transaction
        transaction = Transaction.objects.create(
            user=self.user1,
            stock=stock,
            price=100.0,
            quantity=10,
            action="buy",
        )

        # Create a post from that transaction
        post = Post.objects.create(user=self.user1, transaction=transaction)

        # Like the post
        response = self.client.post("/toggle-post-like/", {"id": post.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "toggled")

        # Unlike the post
        response = self.client.post("/toggle-post-like/", {"id": post.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "toggled")

    def test_comment_on_post(self):
        # Create supporting stock and transaction
        stock = Stock.objects.create(symbol="AAPL", name="Apple Inc.")
        transaction = Transaction.objects.create(
            user=self.user1,
            stock=stock,
            action="buy",
            quantity=10,
            price=150.0,
        )

        # Create the post
        post = Post.objects.create(user=self.user1, transaction=transaction)

        # Comment on the post
        response = self.client.post("/user/post-comment/", {
            "id": post.id,
            "comment": "Nice trade!"
        })

        # Check response
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "commented")

        # Check that the comment was actually created
        self.assertTrue(Comment.objects.filter(post=post, user=self.user1, text="Nice trade!").exists())


