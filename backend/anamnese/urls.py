from django.urls import path
from . import views

urlpatterns = [
    path('processar-anamnese/', views.processar_anamnese, name='processar_anamnese'),
    path('salvar-anamnese/', views.salvar_anamnese, name='salvar_anamnese'),
    path('historico/', views.listar_anamneses, name='listar_anamneses'),
    path('auth/register/', views.register_view, name='register'),
    path('auth/login/', views.login_view, name='login'),
]
