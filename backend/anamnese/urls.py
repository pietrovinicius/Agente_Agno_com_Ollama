from django.urls import path
from .views import processar_anamnese, salvar_anamnese

urlpatterns = [
    path('processar-anamnese/', processar_anamnese, name='processar_anamnese'),
    path('salvar-anamnese/', salvar_anamnese, name='salvar_anamnese'),
]
