from django.db import models

class Anamnese(models.Model):
    texto_original = models.TextField(help_text="Texto bruto da anamnese digitado pelo médico")
    texto_melhorado = models.TextField(help_text="Texto processado e refinado pela IA")
    cid_sugerido = models.CharField(max_length=100, help_text="Código CID-10 sugerido")
    principais_sintomas = models.JSONField(help_text="Lista de sintomas identificados (JSON)")
    tempo_processamento = models.FloatField(default=0.0, help_text="Tempo em segundos que a IA levou para processar")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data de Criação")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Última Atualização")

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Anamnese"
        verbose_name_plural = "Anamneses"

    def __str__(self):
        return f"Anamnese {self.id} - {self.cid_sugerido} ({self.created_at.strftime('%d/%m/%Y')})"
