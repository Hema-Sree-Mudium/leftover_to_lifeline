from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from donations.models import Donation
from .serializers import DonationSerializer, UserSerializer
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from rest_framework.views import APIView

User = get_user_model()

class UserProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        if self.request.user.role == 'ADMIN':
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

class DonationViewSet(viewsets.ModelViewSet):
    serializer_class = DonationSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Donation.objects.all()
        elif user.role == 'DONOR':
            return Donation.objects.filter(donor=user)
        elif user.role == 'NGO':
            return Donation.objects.filter(status='AVAILABLE') | Donation.objects.filter(ngo=user)
        elif user.role == 'VOLUNTEER':
            return Donation.objects.filter(status='ACCEPTED') | Donation.objects.filter(volunteer=user)
        return Donation.objects.none()

    def perform_create(self, serializer):
        serializer.save(donor=self.request.user)

    # Secure state transition controller
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        donation = self.get_object()
        action_type = request.data.get('action')
        user = request.user

        if action_type == 'ACCEPT' and user.role == 'NGO' and donation.status == 'AVAILABLE':
            donation.status = 'ACCEPTED'
            donation.ngo = user
            donation.save()
            return Response({'status': 'Donation accepted securely'})

        elif action_type == 'PICKUP' and user.role == 'VOLUNTEER' and donation.status == 'ACCEPTED':
            donation.status = 'PICKED_UP'
            donation.volunteer = user
            donation.save()
            return Response({'status': 'Donation picked up securely'})

        elif action_type == 'DELIVER' and user.role == 'VOLUNTEER' and donation.status == 'PICKED_UP' and donation.volunteer == user:
            donation.status = 'DELIVERED'
            donation.save()
            return Response({'status': 'Donation delivered securely'})

        return Response({'error': 'Invalid action or unauthorized role.'}, status=status.HTTP_403_FORBIDDEN)

class AdminStatsView(APIView):
    def get(self, request):
        # Hard server-side security lock: Reject anyone who is not an Admin
        if request.user.role != 'ADMIN':
            return Response({'error': 'Unauthorized oversight access.'}, status=status.HTTP_403_FORBIDDEN)

        total_users = User.objects.exclude(role='ADMIN').count()
        total_donations = Donation.objects.count()
        delivered_donations = Donation.objects.filter(status='DELIVERED').count()
        in_transit = Donation.objects.filter(status__in=['ACCEPTED', 'ASSIGNED', 'PICKED_UP']).count()

        return Response({
            'total_users': total_users,
            'total_donations': total_donations,
            'delivered_donations': delivered_donations,
            'in_transit': in_transit
        })
    
class RegisterUserView(APIView):
    permission_classes = [AllowAny] # Crucial: Allows unauthenticated users to sign up

    def post(self, request):
        data = request.data
        try:
            # Check if username already exists
            if User.objects.filter(username=data['username']).exists():
                return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)

            # Create the user securely
            user = User.objects.create_user(
                username=data['username'],
                password=data['password'],
                role=data['role'] # DONOR, NGO, or VOLUNTEER
            )
            return Response({'message': 'Account created successfully!'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)