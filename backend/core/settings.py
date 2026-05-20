"""
Django settings for core project.
"""

import os
from pathlib import Path
import dj_database_url
from dotenv import load_dotenv
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from the .env file (for local dev)
load_dotenv(os.path.join(BASE_DIR, '.env'))

# SECURITY WARNING: keep the secret key used in production secret!
# Dynamically pull from Render, fallback to local key if not found
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-m&+tmwmddcgh$ymj-_(v+2n@kl1dwgz+dqtz3ymw5y+@lrd9^b')

# If RENDER is in the environment, we are in production. Otherwise, local.
DEBUG = 'RENDER' not in os.environ

ALLOWED_HOSTS = ['*']

# For Render Deployment Security
CSRF_TRUSTED_ORIGINS = ['https://leftover-to-lifeline.onrender.com']
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'cloudinary_storage',
    'cloudinary',
    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    # Local apps
    'accounts',
    'donations',
    'api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # WhiteNoise must be here
    'corsheaders.middleware.CorsMiddleware',      # CORS must be high up
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# Database Setup (Dynamic for Neon / Local SQLite fallback)
DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///db.sqlite3',
        conn_max_age=600,
        ssl_require=not DEBUG # Requires SSL in production (Neon), ignores it locally
    )
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files and Media Variables
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Cloudinary Credentials
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.environ.get('CLOUDINARY_CLOUD_NAME', 'your_local_cloud_name'),
    'API_KEY': os.environ.get('CLOUDINARY_API_KEY', 'your_local_api_key'),
    'API_SECRET': os.environ.get('CLOUDINARY_API_SECRET', 'your_local_api_secret'),
}

# --- MODERN DJANGO STORAGE ENGINE ---
# Dummy fallback to prevent dj3-cloudinary-storage crash
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

STORAGES = {
    "default": {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}

# Custom User Model
AUTH_USER_MODEL = 'accounts.CustomUser'

# Django REST Framework Settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# SECURITY WARNING: Keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-...')

DEBUG = 'RENDER' not in os.environ

# 1. ALLOWED HOSTS (Must include Render)
ALLOWED_HOSTS = ['leftover-to-lifeline.onrender.com', 'localhost', '127.0.0.1']

# 2. CORS CONFIGURATION (Strictly Whitelisting Vercel)
# Do NOT use CORS_ALLOW_ALL_ORIGINS = True in production.
CORS_ALLOWED_ORIGINS = [
    "https://leftover-to-lifeline.vercel.app", # Replace with your exact Vercel URL
    "http://localhost:5173", # For local React testing
]
CORS_ALLOW_CREDENTIALS = True # Critical for passing JWT tokens/sessions

# 3. CSRF & SECURE PROXY CONFIGURATION (The Render Fix)
# This forces Django to trust the Render HTTPS proxy, preventing the crashes
CSRF_TRUSTED_ORIGINS = [
    'https://leftover-to-lifeline.onrender.com',
    'https://leftover-to-lifeline.vercel.app',
]
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')