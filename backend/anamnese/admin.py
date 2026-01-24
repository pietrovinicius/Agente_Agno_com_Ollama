from django.contrib import admin
from .models import Anamnese

@admin.register(Anamnese)
class AnamneseAdmin(admin.ModelAdmin):
    list_display = ('cid_sugerido', 'display_tempo_processamento', 'created_at', 'preview_texto')
    list_filter = ('created_at', 'cid_sugerido')
    search_fields = ('texto_original', 'texto_melhorado', 'cid_sugerido')
    readonly_fields = ('created_at', 'updated_at', 'tempo_processamento')

    def display_tempo_processamento(self, obj):
        return f"{obj.tempo_processamento:.2f}s"
    display_tempo_processamento.short_description = "Tempo Processamento"
    display_tempo_processamento.admin_order_field = 'tempo_processamento'

    def preview_texto(self, obj):
        return obj.texto_melhorado[:50] + "..." if obj.texto_melhorado else "-"
    preview_texto.short_description = "Resumo"
