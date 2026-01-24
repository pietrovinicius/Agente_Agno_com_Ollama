import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from anamnese.models import Anamnese

@pytest.mark.django_db
class TestPerformanceTracking:
    def setup_method(self):
        self.client = APIClient()
        self.url = reverse('salvar_anamnese')  # Certifique-se que o nome da url está correto no urls.py
        self.valid_payload = {
            "texto_original": "Paciente relata dor de cabeça intensa.",
            "texto_melhorado": "Paciente refere cefaleia intensa.",
            "cid_sugerido": "R51",
            "principais_sintomas": ["Cefaleia"],
            "tempo_processamento": 12.45
        }

    def test_salvar_anamnese_com_tempo_processamento(self):
        """
        Teste: Enviar payload com tempo_processamento e verificar se é salvo corretamente.
        """
        response = self.client.post(self.url, self.valid_payload, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Anamnese.objects.count() == 1
        
        anamnese = Anamnese.objects.first()
        assert anamnese.tempo_processamento == 12.45
        assert anamnese.cid_sugerido == "R51"

    def test_salvar_anamnese_sem_tempo_processamento(self):
        """
        Teste: Enviar payload sem tempo_processamento (deve usar default 0.0).
        """
        payload_sem_tempo = self.valid_payload.copy()
        del payload_sem_tempo['tempo_processamento']
        
        response = self.client.post(self.url, payload_sem_tempo, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        anamnese = Anamnese.objects.last() # Pega o último criado
        assert anamnese.tempo_processamento == 0.0

    def test_admin_display_tempo(self):
        """
        Teste: Verificar se o método display do admin formata corretamente.
        (Teste unitário da função display_tempo_processamento do Admin)
        """
        from anamnese.admin import AnamneseAdmin
        from django.contrib.admin.sites import AdminSite
        
        anamnese = Anamnese.objects.create(**self.valid_payload)
        admin_instance = AnamneseAdmin(Anamnese, AdminSite())
        
        display_value = admin_instance.display_tempo_processamento(anamnese)
        assert display_value == "12.45s"
