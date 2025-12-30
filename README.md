# Vzla Smart Pay (BolivaresVsDolares)

Una calculadora inteligente diseñada para ayudar a los usuarios en Venezuela a decidir la mejor forma de pagar (Bolívares, Dólares en efectivo o USDT) basándose en las tasas de cambio actuales y el impuesto IGTF.

## Características

- **Tasas en Tiempo Real**: Monitoreo de tasas BCV, Paralelo (USDT) y Promedios.
- **Calculadora Inteligente**: Compara el costo real de pagar en Bs vs Divisas.
- **Cálculo de Ahorro**: Muestra cuánto ahorras usando la estrategia recomendada.
- **Modo Manual**: Permite ajustar las tasas manualmente si el API no responde o hay discrepancias.
- **Interfaz Moderna**: Diseño limpio y responsivo con soporte para modo oscuro.

## Tecnologías

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) (Iconos)

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/BolivaresVsDolares.git
```

2. Instalar dependencias:
```bash
npm install
```

3. Correr el servidor de desarrollo:
```bash
npm run dev
```

4. Abrir [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

- `/app`: Páginas y layouts de Next.js (App Router).
- `/components`: Componentes de React reutilizables (`SmartCalculator`, `RateDashboard`).
- `/context`: Contexto de React para el manejo de estado global (Tasas).
- `/lib`: Utilidades y constantes.
- `/*.py`: Scripts de Python para pruebas e inspección de APIs de tasas.
