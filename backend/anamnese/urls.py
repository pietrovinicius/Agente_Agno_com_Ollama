from django.urls import path
from .views import processar_anamnese

urlpatterns = [
    path('processar-anamnese/', processar_anamnese, name='processar_anamnese'),
]
