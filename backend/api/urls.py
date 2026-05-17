from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import DonationViewSet, UserProfileViewSet, AdminStatsView

router = DefaultRouter()
router.register(r'donations', DonationViewSet, basename='donation')
router.register(r'users', UserProfileViewSet, basename='user')

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin-stats/', AdminStatsView.as_view(), name='admin_stats'), # New secure endpoint
    path('', include(router.urls)),
]