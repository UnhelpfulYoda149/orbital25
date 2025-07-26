from django.db import models
from django.contrib.auth.models import User

class Stock(models.Model):
    symbol = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    
class HistoryStock(models.Model): #To store historical stock info
    symbol = models.CharField(max_length=10)
    name = models.CharField(max_length=255)
    timestamp = models.DateTimeField()
    open = models.FloatField()
    lastTrade = models.FloatField()
    high = models.FloatField()
    low = models.FloatField()
    close = models.FloatField()
    volume = models.BigIntegerField()
    var = models.FloatField(default=0.0)

    class Meta:
        unique_together = ('symbol', 'timestamp')
        ordering = ['-timestamp']

    def __str__(self):
        return self.name
    

class LiveStock(models.Model): #To store live stock data
    symbol = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=255)
    timestamp = models.DateTimeField()
    open = models.FloatField()
    lastTrade = models.FloatField()
    high = models.FloatField()
    low = models.FloatField()
    close = models.FloatField()
    volume = models.BigIntegerField()
    var = models.FloatField(default=0.0)

    def __str__(self):
        return self.name

class Transaction(models.Model):
    BUY = 'buy'
    SELL = 'sell'
    ACTIONS = [
        (BUY, 'Buy'),
        (SELL, 'Sell'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    action = models.CharField(max_length=4, choices=ACTIONS)
    quantity = models.PositiveIntegerField()
    price = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)
    realized_pnl = models.FloatField(null=True, blank=True)  # optional
    order_id = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} {self.action} {self.quantity} {self.stock}"


class Portfolio(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    average_price = models.FloatField()

    class Meta:
        unique_together = ("user", "stock")

    def __str__(self):
        return f"{self.user.username} - {self.stock}: {self.quantity} @ {self.average_price}"
    

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("user", "stock")

    def __str__(self):
        return f"{self.user.username} - {self.stock.symbol}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    money = models.FloatField(default=10000)
    bio = models.TextField(blank=True, default="") 

    def __str__(self):
        return f"{self.user.username}"
    
class FriendRequest(models.Model):
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_request")
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_request")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("from_user", "to_user")

    def __str__(self):
        return f"{self.from_user.username} has requested {self.to_user.username}"
    
class Friend(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friend1")
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friend2")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user1", "user2")

    def save(self, *args, **kwargs):
        if self.user1.id > self.user2.id:
            self.user1, self.user2 = self.user2, self.user1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user1.username} and {self.user2.username} are friends"
    
class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "transaction")
        ordering = ["-timestamp"]  
        
    def __str__(self):
        return f"{self.user.username} posted {self.transaction}"
    
class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    timestamp = models.DateTimeField(auto_now_add=True)
    text = models.TextField() 

    class Meta:
        ordering = ["-timestamp"]  
        
    def __str__(self):
        return f"{self.user.username} commented on {self.post} at {self.timestamp}"
    
class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "post")

    def __str__(self):
        return f"{self.user.username} liked {self.post}"
    
class Order(models.Model):
    BUY = 'buy'
    SELL = 'sell'
    PURCHASE_ACTIONS = [
        (BUY, 'Buy'),
        (SELL, 'Sell'),
    ]

    GTC = "gtc"
    DAY = "day"
    EXPIRY_ACTIONS = [
        (GTC, "GTC"),
        (DAY, "Day")
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    action = models.CharField(max_length=4, choices=PURCHASE_ACTIONS)
    expiry = models.CharField(max_length=3, choices=EXPIRY_ACTIONS)
    quantity = models.PositiveIntegerField()
    price = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]  

    def __str__(self):
        return f"{self.user.username} orders {self.action} {self.quantity} {self.stock}: {self.expiry}"