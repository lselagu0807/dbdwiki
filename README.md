#🔪 DBDWiki - La Niebla te espera 🌫️
DBDWiki es una aplicación web interactiva diseñada para los fanáticos de Dead by Daylight. Explora el lore, domina las habilidades de los sobrevivientes y conoce a fondo a cada asesino para sobrevivir al Ritual del Ente.

Este proyecto ha sido desarrollado con un enfoque en el rendimiento mediante el uso de formatos de imagen modernos y reactividad avanzada.

✨ Características Principales
🕵️ Explorador de Personajes: Información detallada sobre Killers y Survivors.

📜 Lore & Habilidades: Consulta las 3 perks únicas de cada personaje y su trasfondo.

🗺️ Galería de Reinos: Carrusel interactivo con más de 15 mapas icónicos optimizados en formato .webp.

⚡ Interfaz Reactiva: Implementación de Angular Signals para un estado de carga limpio y eficiente.

🎬 Experiencia Inmersiva: Fondos dinámicos fijos (Parallax) y transiciones suaves con GIFs.

🚀 Tecnologías Utilizadas
Framework: Angular 18+ (Standalone Components & Signals).

Estilos: Bootstrap 5 para un diseño responsive y componentes de UI.

Diseño: CSS3 avanzado con efectos de background-attachment: fixed y backdrop-filter.

Multimedia: Optimización masiva de imágenes a formato WebP para una carga ultrarrápida.

🛠️ Instalación y Desarrollo
Sigue estos pasos para ejecutar el proyecto en tu máquina local:

Clona el repositorio:

Bash
git clone https://github.com/tu-usuario/dbdwiki.git
Instala las dependencias:

Bash
npm install
Inicia el servidor de desarrollo:

Bash
ng serve
Abre tu navegador: Navega a http://localhost:4200/. El servidor se recargará automáticamente si cambias algún archivo fuente.

📂 Estructura del Proyecto
Plaintext
src/
├── app/
│   ├── components/
│   │   ├── home/      # Sección principal con carrusel de mapas
│   │   ├── killer/    # Listado de asesinos
│   │   └── loader/    # Componente de carga con Signals
│   └── services/      # Lógica de API y LoadingService
└── assets/
    ├── image/         # Imágenes estáticas y mapas (.webp)
    └── video/         # GIFs de fondo y habilidades
👤 Autor
Luis - Desarrollo Inicial y Diseño con API.

Nota del Ente: "La muerte no es un escape". ¡Buena suerte en la niebla! 💀
