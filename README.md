# 🔪 DBDWiki - La Niebla te espera 🌫️

> **Proyecto de diseño con API para fans de Dead by Daylight**

![DBDWiki Preview](https://github.com/tu-usuario/dbdwiki/raw/main/src/assets/video/gif-bg.gif)

## 📖 Descripción
**DBDWiki** es una plataforma interactiva construida con **Angular** que permite a los usuarios explorar el oscuro universo de Dead by Daylight. El proyecto se enfoca en una experiencia de usuario fluida, utilizando técnicas de posicionamiento fijo para crear un efecto de profundidad con la niebla icónica del juego.

---

## ✨ Características Principales

* **⚡ Reactividad con Signals:** Implementación de `LoadingService` utilizando **Angular Signals** para gestionar estados de carga globales de forma limpia y eficiente.
* **🖼️ Rendimiento Optimizado:** Uso intensivo de formatos **WebP** para los mapas, reduciendo drásticamente los tiempos de carga en el carrusel.
* **🎭 Interfaz Inmersiva:** * Efectos de **Parallax** en las secciones de información.
    * Transiciones dinámicas entre fondos animados (GIF) y estáticos al hacer scroll.
* **📱 Diseño Responsivo:** Estructura basada en **Bootstrap 5** con un sistema de rejilla adaptable y componentes interactivos como el carrusel de mapas.

---

## 🚀 Tecnologías

* **Framework:** Angular 18+ (Standalone Components).
* **Estilos:** Bootstrap 5 & CSS Personalizado.
* **Estado:** Angular Signals.
* **Asset Management:** Optimización de multimedia para la web.

---

## 📂 Estructura del Proyecto

El código está organizado siguiendo las mejores prácticas de Angular:

```text
src/app/
├── components/
│   ├── home/      # Lógica del carrusel y efectos de fondo
│   ├── killer/    # Listado y detalle de asesinos
│   ├── survivor/  # Listado y detalle de sobrevivientes
│   └── loader/    # Componente de carga reactivo
├── services/      # Servicios de datos y carga global
└── assets/        # Recursos multimedia (WebP, GIF, PNG)
