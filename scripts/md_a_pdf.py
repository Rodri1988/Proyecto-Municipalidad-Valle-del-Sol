#!/usr/bin/env python3
"""Convierte .md a .pdf (texto legible). Uso del equipo SIGI."""

import re
import sys
from pathlib import Path

from fpdf import FPDF


def normalizar_unicode(texto: str) -> str:
    reemplazos = {
        '\u2014': '-',
        '\u2013': '-',
        '\u201c': '"',
        '\u201d': '"',
        '\u2018': "'",
        '\u2019': "'",
        '\u2026': '...',
        '\u2192': '->',
        '\u2190': '<-',
    }
    for k, v in reemplazos.items():
        texto = texto.replace(k, v)
    return texto.encode('latin-1', 'replace').decode('latin-1')


def partir_linea(texto: str, max_chars: int = 95) -> list[str]:
    if len(texto) <= max_chars:
        return [texto]
    partes = []
    while len(texto) > max_chars:
        corte = texto.rfind(' ', 0, max_chars)
        if corte <= 0:
            corte = max_chars
        partes.append(texto[:corte].strip())
        texto = texto[corte:].strip()
    if texto:
        partes.append(texto)
    return partes


def limpiar_markdown(texto: str) -> list[str]:
    lineas = []
    en_bloque_codigo = False
    for raw in texto.splitlines():
        linea = raw.rstrip()
        if linea.strip().startswith('```'):
            en_bloque_codigo = not en_bloque_codigo
            continue
        if en_bloque_codigo:
            for trozo in partir_linea(normalizar_unicode(linea)):
                lineas.append(trozo)
            continue
        if linea.strip().startswith('flowchart') or linea.strip().startswith('gitGraph'):
            continue
        if linea.strip() == '---':
            lineas.append('')
            continue
        if linea.startswith('#'):
            nivel = len(linea) - len(linea.lstrip('#'))
            linea = linea.lstrip('#').strip()
            prefijo = '  ' * max(0, nivel - 1)
            lineas.append('')
            lineas.append(normalizar_unicode(f"{prefijo}{linea.upper() if nivel == 1 else linea}"))
            continue
        linea = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', linea)
        linea = re.sub(r'`([^`]+)`', r'\1', linea)
        linea = re.sub(r'\*\*([^*]+)\*\*', r'\1', linea)
        linea = re.sub(r'\*([^*]+)\*', r'\1', linea)
        if linea.startswith('|') and linea.endswith('|'):
            celdas = [c.strip() for c in linea.strip('|').split('|')]
            if all(set(c) <= {'-', ':', ' '} for c in celdas):
                continue
            lineas.append(normalizar_unicode(' | '.join(celdas)))
            continue
        if linea.startswith('```'):
            continue
        if linea.startswith('>'):
            linea = linea.lstrip('> ').strip()
        for trozo in partir_linea(normalizar_unicode(linea)):
            lineas.append(trozo)
    return lineas


class PdfInforme(FPDF):
    def footer(self):
        self.set_y(-12)
        self.set_font('Helvetica', 'I', 8)
        self.cell(0, 8, f'Página {self.page_no()}', align='C')


def convertir(entrada: Path, salida: Path) -> None:
    texto = entrada.read_text(encoding='utf-8')
    lineas = limpiar_markdown(texto)

    pdf = PdfInforme()
    pdf.set_margins(15, 15, 15)
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_page()
    pdf.set_font('Helvetica', size=10)
    ancho = pdf.epw

    for linea in lineas:
        if not linea or not linea.strip():
            pdf.ln(3)
            continue
        if linea.isupper() and len(linea) < 80:
            pdf.ln(2)
            pdf.set_font('Helvetica', 'B', 12)
            pdf.multi_cell(ancho, 6, linea)
            pdf.set_font('Helvetica', size=10)
            continue
        pdf.multi_cell(ancho, 5, linea)

    salida.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(salida))


def main() -> int:
    if len(sys.argv) < 2:
        print('Uso: md_a_pdf.py archivo.md [salida.pdf]')
        return 1
    entrada = Path(sys.argv[1]).resolve()
    salida = Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else entrada.with_suffix('.pdf')
    convertir(entrada, salida)
    print(salida)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
