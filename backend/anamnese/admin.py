from django.contrib import admin
from .models import Anamnese

@admin.register(Anamnese)
class AnamneseAdmin(admin.ModelAdmin):
    list_display = ('cid_sugerido', 'created_at', 'preview_texto')
    list_filter = ('created_at', 'cid_sugerido')
    search_fields = ('texto_original', 'texto_melhorado', 'cid_sugerido')
    readonly_fields = ('created_at', 'updated_at')

    def preview_texto(self, obj):
        return obj.texto_melhorado[:50] + "..." if obj.texto_melhorado else "-"
    preview_texto.short_description = "Resumo"
