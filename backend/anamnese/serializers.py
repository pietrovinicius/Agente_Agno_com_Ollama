from rest_framework import serializers
from .models import Anamnese

class AnamneseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anamnese
        fields = ['id', 'texto_original', 'texto_melhorado', 'cid_sugerido', 'principais_sintomas', 'created_at']
        read_only_fields = ['id', 'created_at']
