# Documentación de entrega — S.I.G.I.

Documentos para la Subdirección de Diseño Instruccional y defensa del proyecto.

| Documento | Archivo | Exportar a PDF |
|-----------|---------|-----------------|
| Análisis de patrones y arquetipos | [ANALISIS_PATRONES_Y_ARQUETIPOS.md](ANALISIS_PATRONES_Y_ARQUETIPOS.md) | Imprimir / Pandoc |
| Plan de branching | [PLAN_DE_BRANCHING.md](PLAN_DE_BRANCHING.md) | Imprimir / Pandoc |
| Instrucciones de uso | [INSTRUCCIONES_DE_USO.md](INSTRUCCIONES_DE_USO.md) | Imprimir / Pandoc |
| Informe técnico completo | [../INFORME_PROYECTO_SIGI.md](../INFORME_PROYECTO_SIGI.md) | Imprimir / Pandoc |

## Generar PDF con Pandoc (si está instalado)

Desde la raíz del proyecto:

```bash
pandoc docs/ANALISIS_PATRONES_Y_ARQUETIPOS.md -o docs/ANALISIS_PATRONES_Y_ARQUETIPOS.pdf --toc -V geometry:margin=2.5cm
pandoc docs/PLAN_DE_BRANCHING.md -o docs/PLAN_DE_BRANCHING.pdf --toc -V geometry:margin=2.5cm
pandoc docs/INSTRUCCIONES_DE_USO.md -o docs/INSTRUCCIONES_DE_USO.pdf --toc -V geometry:margin=2.5cm
```

## Generar PDF sin Pandoc

1. Abrir el `.md` en **Microsoft Word** (arrastrar archivo) o **Google Docs** (importar).
2. Ajustar portada: Duoc UC, nombres, asignatura, fecha.
3. **Archivo > Exportar / Imprimir > PDF**.

## Generar PDF desde macOS Preview

1. Abrir el Markdown en VS Code con vista previa.
2. Copiar al portapapeles o imprimir la vista previa.
3. **Guardar como PDF**.
