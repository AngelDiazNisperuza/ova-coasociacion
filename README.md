# Coasocia — prototipo con diseño Academic Horizon 0.2

## Propósito

Sitio web estático para probar una experiencia didáctica de coasociación con estudiantes de educación media académica (10.º y 11.º), a partir del capítulo V de la tesis doctoral *Propuesta didáctica hacia el fomento de habilidades transversales desde la pedagogía de la coasociación en estudiantes de educación media académica*, de Ibeth Patricia Ruiz Olea.

**No es una intervención validada ni un instrumento psicométrico.** La única actividad es una demostración propuesta para revisión docente; los valores numéricos son simulados y no representan resultados de investigación.

## Correspondencia con las dimensiones de la tesis

- DE1: orientación para docentes sobre mediación y reflexión pedagógica (tabla 9)
- DE2: actividad interdisciplinaria, aprendizaje basado en problemas, diálogo y propuesta colectiva (tabla 10)
- DE3: ficha imprimible de evidencias y autovaloración formativa (tabla 11)

## Cómo abrir

Abrir `index.html` en un navegador moderno. No requiere compilación, dependencias, conexión a internet, autenticación ni base de datos.

## Cómo desplegar la primera versión en Cloudflare Pages

1. Crear un **repositorio nuevo y separado** en GitHub, `ova-coasociacion`.
2. Los archivos `index.html`, `styles.css` y `app.js` ya están en la raíz; las imágenes se incorporan manualmente en `assets/imagenes/`.
3. En Cloudflare, crear un proyecto de **Workers & Pages > Pages**, conectado al repositorio nuevo (si esta opción aparece en la cuenta).
4. Configurar el proyecto como sitio estático: **sin framework**, comando de compilación vacío y directorio de salida `.` (raíz del repositorio).
5. Publicar y comprobar: carga de la página, enlaces del menú, dos preguntas con retroalimentación, áreas de texto, autovaloración, impresión y pantalla móvil.
6. Verificar la URL proporcionada por Cloudflare y no agregar usuarios o almacenamiento hasta aprobar las pruebas de contenido y privacidad.

No usar Cloudflare D1, Workers API, claves de acceso ni agentes de IA en esta primera fase.

## Privacidad

No incluye envío de datos por red, cookies, analítica, localStorage, contraseñas o identificación personal. Los textos escritos se conservan solo en la memoria de la página abierta; el usuario puede imprimirlos mediante la función del navegador y guardarlos como PDF si el sistema ofrece esa opción.

## Validación antes de uso educativo

La autora y los docentes deben revisar la pertinencia del reto, los indicadores de habilidades, el tiempo, el lenguaje, la accesibilidad, la relación con el currículo de grados 10.º y 11.º y los procedimientos de consentimiento/aprobación ética cuando corresponda.

## Siguientes fases (no implementadas)

1. Ampliar a una secuencia validada de unidades didácticas por áreas.
2. Diseñar instrumentos formativos y rúbricas con criterios observables y evidencia por equipo.
3. Revisar la necesidad real de autenticación, almacenamiento de evidencias y roles.
4. Incorporar módulos de administración o acompañamiento mediante IA solo si tienen justificación pedagógica, evaluación y controles de seguridad.

## Imágenes y fotografías personalizables

Se han creado las carpetas `assets/imagenes/fondos/`, `assets/imagenes/figuras/`, `assets/imagenes/fotografias/`, `assets/imagenes/logos/` y `assets/imagenes/iconos/`. Ver [`assets/imagenes/README.md`](assets/imagenes/README.md) para nombres y recomendaciones.

Tres fondos se habilitan de manera automática cuando se cargan sus imágenes JPG con nombres exactos: `portada.jpg`, `reto.jpg` y `docentes.jpg`. La web muestra los colores de respaldo antes de que existan las fotos. **Las figuras, logos y demás fotografías requieren selección e integración posterior; subirlas al repositorio no las muestra inmediatamente.**

Para cargar manualmente en GitHub: abrir la carpeta deseada, seleccionar **Add file > Upload files**, arrastrar las imágenes y pulsar **Commit changes**. Si Cloudflare Pages queda conectado con GitHub, cada cambio puede generar una nueva publicación.

## Control de cambios

Esta primera versión es estática; no usar sesiones, contraseñas, D1 ni Workers todavía. Antes de publicar imágenes, verificar derechos de uso y privacidad, especialmente si aparecen menores de edad.

## Diseño Academic Horizon (versión 0.2)

La hoja `academic-horizon.css` se carga después de `styles.css` y adapta la interfaz a la paleta azul marino institucional, verde de acción, superficies claras, componentes con bordes finos, botones de radio 8px, tarjetas de radio 16px y disposición adaptable. El contenido y la lógica de `app.js` permanecen sin cambios. Para revertir solo el aspecto visual, retirar el enlace de `academic-horizon.css` de `index.html`.

Las fuentes Plus Jakarta Sans e Inter se solicitan al servidor de Google Fonts en navegadores conectados; la aplicación utiliza fuentes locales de reserva cuando no hay internet. Estos recursos de estilo pueden generar solicitudes de red al proveedor de fuentes, pero los datos introducidos en las actividades no se envían a dicho proveedor ni a ningún servidor del proyecto. Una mejora de privacidad posterior puede alojar los archivos tipográficos localmente.

Se confirmaron los archivos `portada.jpg`, `Split-Panel Learning Workspace Banner-2.png` y `Dual Educational Study and Teaching Scenes-1.png` en la carpeta de fondos. Mientras no existan `reto.jpg` y `docentes.jpg`, el diseño incorpora los dos PNG como respaldo visual; si luego se publican los JPG con los nombres previstos, prevalecerán como primera imagen de cada sección.
