from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User

class AuthTests(APITestCase):

    def test_user_registration_success(self):
        response = self.client.post(reverse('register'), {
            "username": "newuser",
            "password": "Password@123"
        })
        self.assertEqual(response.status_code, 201)

    def test_user_registration_invalid(self):
        response = self.client.post(reverse('register'), {
            "username": "",
            "password": ""
        })
        self.assertEqual(response.status_code, 400)

    def test_user_login_success(self):
        User.objects.create_user(username="testuser", password="Password@123")
        response = self.client.post(reverse('login'), {
            "username": "testuser",
            "password": "Password@123"
        })
        self.assertEqual(response.status_code, 200)

    def test_user_login_invalid(self):
        response = self.client.post(reverse('login'), {
            "username": "wronguser",
            "password": "wrongpass"
        })
        self.assertEqual(response.status_code, 401)
