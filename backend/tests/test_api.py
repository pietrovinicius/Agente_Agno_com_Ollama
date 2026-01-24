import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from unittest.mock import MagicMock, patch


@pytest.mark.django_db
class TestAnamneseAPI:
    def setup_method(self):
        self.client = APIClient()
        self.url = reverse('processar_anamnese')

    @patch('anamnese.views.get_medical_agent')
    def test_processar_anamnese_success(self, mock_get_agent):
        # Mocking the agent response
        mock_agent_instance = MagicMock()
        mock_run_response = MagicMock()

        # Structure of the expected response from Agno agent
        expected_data = {
            "texto_melhorado": "Paciente relata cefaleia intensa com evolução de 3 dias, associada a fotofobia.",
            "cid_sugerido": "R51",
            "principais_sintomas": ["Cefaleia", "Fotofobia"]
        }

        # Mocking Pydantic model dump
        class MockContent:
            def model_dump(self):
                return expected_data

        mock_run_response.content = MockContent()

        # The agent.run method returns the response object
        mock_agent_instance.run.return_value = mock_run_response
        mock_get_agent.return_value = mock_agent_instance

        # Request data
        payload = {"texto": "dor de cabeça forte há 3 dias e incomodo com a luz"}

        # Execute request
        response = self.client.post(self.url, payload, format='json')

        # Assertions
        assert response.status_code == 200
        assert response.data['cid_sugerido'] == "R51"
        assert "Cefaleia" in response.data['principais_sintomas']
        assert response.data['texto_melhorado'] == expected_data['texto_melhorado']

    def test_processar_anamnese_missing_text(self):
        payload = {}
        response = self.client.post(self.url, payload, format='json')

        assert response.status_code == 400
        assert "erro" in response.data

    @patch('anamnese.views.get_medical_agent')
    def test_processar_anamnese_internal_error(self, mock_get_agent):
        # Simulate an error in the agent
        mock_agent_instance = MagicMock()
        mock_agent_instance.run.side_effect = Exception("Erro interno no Ollama")
        mock_get_agent.return_value = mock_agent_instance

        payload = {"texto": "teste"}
        response = self.client.post(self.url, payload, format='json')

        assert response.status_code == 500
        assert "Falha ao processar com IA" in response.data['erro']
