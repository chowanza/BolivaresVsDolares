# Agentes del Sistema

Este proyecto se apoya en una serie de scripts y herramientas ("agentes") para su funcionamiento y desarrollo.

## Agentes de Datos (Scripts de Python)

Estos scripts se encargan de validar, inspeccionar y probar las conexiones con las fuentes de datos externas (APIs de tasas).

| Agente | Descripción |
|--------|-------------|
| `inspect_bcv.py` | Validador de conexión y estructura de datos para la tasa oficial del BCV. |
| `test_binance_p2p.py` | Monitor de tasas P2P en Binance para referencia de mercado paralelo (USDT). |
| `test_eur.py` | Verificador específico para tasas de cambio relacionadas con el Euro. |
| `inspect_monitors_v2.py` | Script de monitoreo avanzado para múltiples fuentes de tasas. |
| `inspect_provider.py` | Capa de abstracción para probar diferentes proveedores de datos. |

## Agentes de Desarrollo (AI)

| Agente | Rol |
|--------|-----|
| **GitHub Copilot** | Asistente de programación principal. Encargado de la generación de código, refactorización de componentes React, corrección de errores de sintaxis y documentación. |
