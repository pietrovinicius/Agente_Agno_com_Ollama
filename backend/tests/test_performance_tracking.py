import pytest
from rest_framework.test import APIClient
from anamnese.models import Anamnese

@pytest.mark.django_db
def test_salvar_anamnese_com_tempo_processamento():
    """
    Testa se o endpoint salvar-anamnese persiste corretamente o campo tempo_processamento.
    """
    client = APIClient()
    # O endpoint definido em views.py é 'salvar_anamnese', mas a rota em urls.py deve ser verificada.
    # Assumindo '/api/salvar-anamnese/' conforme App.jsx e logs anteriores.
    
    payload = {
        "texto_original": "Paciente relata dor de cabeça.",
        "texto_melhorado": "Cefaleia relatada pelo paciente.",
        "cid_sugerido": "R51",
        "principais_sintomas": ["Cefaleia"],
        "tempo_processamento": 1.23
    }
    
    response = client.post('/api/salvar-anamnese/', payload, format='json')
    
    assert response.status_code == 201
    assert Anamnese.objects.count() == 1
    
    anamnese = Anamnese.objects.first()
    assert anamnese.tempo_processamento == 1.23
    assert anamnese.cid_sugerido == "R51"

@pytest.mark.django_db
def test_salvar_anamnese_sem_tempo_processamento_usa_default():
    """
    Testa se o valor default (0.0) é usado quando tempo_processamento não é enviado.
    """
    client = APIClient()
    payload = {
        "texto_original": "Paciente relata febre.",
        "texto_melhorado": "Pirexia relatada.",
        "cid_sugerido": "R50",
        "principais_sintomas": ["Febre"]
        # tempo_processamento omitido
    }
    
    response = client.post('/api/salvar-anamnese/', payload, format='json')
    
    assert response.status_code == 201
    anamnese = Anamnese.objects.first()
    assert anamnese.tempo_processamento == 0.0
