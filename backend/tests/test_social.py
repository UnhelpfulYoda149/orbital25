from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from api.models import FriendRequest, Post, Comment, Like
from api.models import UserProfile

class SocialFeaturesTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='Password@123')
        self.user2 = User.objects.create_user(username='user2', password='Password@123')
        UserProfile.objects.get_or_create(user=self.user1)
        UserProfile.objects.get_or_create(user=self.user2)

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
        response = self.client.post("/toggle-friend-request/", {"to_user": "user2"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("status", response.data)

        # Cancel request
        response = self.client.post("/toggle-friend-request/", {"to_user": "user2"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "Send Request")

    def test_accept_and_remove_friend(self):
        # Send from user1
        self.client.post("/toggle-friend-request/", {"to_user": "user2"})

        # Switch to user2 and accept
        res = self.client.post("/api/token/", {"username": "user2", "password": "Password@123"})
        token2 = res.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + token2)

        response = self.client.post("/accept-friend-request/", {"from_user": "user1"})
        self.assertEqual(response.status_code, 200)

        # Remove friend
        response = self.client.post("/remove-friend/", {"friend": "user1"})
        self.assertEqual(response.status_code, 200)

    def test_like_and_unlike_post(self):
        # Create a post manually
        post = Post.objects.create(user=self.user1, content="Test post")

        # Like the post
        response = self.client.post("/toggle-post-like/", {"post_id": post.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["liked"], True)

        # Unlike the post
        response = self.client.post("/toggle-post-like/", {"post_id": post.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["liked"], False)

    def test_comment_on_post(self):
        post = Post.objects.create(user=self.user1, content="Test post")
        response = self.client.post("/user/post-comment/", {
            "post_id": post.id,
            "text": "Nice trade!"
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["comment"]["text"], "Nice trade!")
