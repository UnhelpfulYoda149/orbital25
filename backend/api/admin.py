from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(Stock)
admin.site.register(LiveStock)
admin.site.register(HistoryStock)
admin.site.register(Transaction)
admin.site.register(Portfolio)
admin.site.register(Watchlist)
admin.site.register(UserProfile)
admin.site.register(FriendRequest)
admin.site.register(Friend)
admin.site.register(Post)
admin.site.register(Like)
admin.site.register(Comment)