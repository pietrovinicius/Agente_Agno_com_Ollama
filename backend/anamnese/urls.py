from django.urls import path
from .views import processar_anamnese, salvar_anamnese, listar_anamneses

urlpatterns = [
    path('processar-anamnese/', processar_anamnese, name='processar_anamnese'),
    path('salvar-anamnese/', salvar_anamnese, name='salvar_anamnese'),
    path('historico/', listar_anamneses, name='listar_anamneses'),
]
