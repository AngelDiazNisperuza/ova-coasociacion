# Coasocia — prototipo con diseño Academic Horizon 0.2


## Estado actual (fase de cuentas y seguimiento)

La página estática y la ruleta siguen disponibles públicamente en Cloudflare Pages. El módulo de acceso, administración de estudiantes y guardado de progreso utiliza Pages Functions y la base D1. La migración 0001 contiene las tablas de usuarios, clases, sesiones y autenticación; la migración 0002 agrega la tabla de progreso y debe aplicarse antes de guardar respuestas.

La autenticación usa un PIN numérico de 4 dígitos para estudiantes y docentes, sin bloqueo temporal de cuentas por fallos. El servidor verifica los roles para las acciones administrativas; el docente solo puede gestionar los estudiantes de sus clases. El PIN nuevo se muestra una vez, no se conserva en texto claro y el cambio mantiene el progreso registrado. La eliminación definitiva borra la cuenta y sus actividades.

**Límite de seguridad:** sin medidas antibots, PIN de 4 dígitos es débil en Internet. No utilizar datos personales o expedientes académicos; completar pruebas técnicas, aprobaciones institucionales y protección frente a intentos automatizados antes de utilizar la plataforma con menores.

Las descripciones posteriores de la etapa estática son un registro histórico del prototipo inicial, no instrucciones vigentes para la funcionalidad de usuarios.

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


## Selector de estudiantes y docentes

En la franja visual del reto aparecen dos accesos de demostración. **Estudiantes** conduce a la secuencia de actividades (`#paso-1`); **Docentes** conduce a las orientaciones pedagógicas (`#docentes`). Actualmente son enlaces públicos dentro del mismo OVA: no existen cuentas, contraseñas, verificación de identidad ni autorización de administración. Cuando se implemente autenticación con un servicio de backend, el rol docente será el administrador del OVA y las funciones de gestión estarán protegidas por controles de acceso del servidor.


## Autenticación con Pages Functions y D1 (fase 0.5)
- Coasocia mantiene su sitio estático en Cloudflare Pages y añade funciones de servidor bajo functions/api/.
- Acceso desde /acceso.html; panel de docentes y estudiantes en /panel.html.
- Seudónimos para estudiantes; registro únicamente con un código de clase emitido por el docente; contraseñas con PBKDF2-SHA-256, sal aleatoria y 210 000 iteraciones; sesión con cookie HttpOnly, Secure y SameSite=Lax.
- El primer docente se activa con una clave secreta configurada en Cloudflare bajo ADMIN_SETUP_KEY (mínimo 24 caracteres), nunca en GitHub.
- Las clases tienen códigos de registro almacenados únicamente como hash, y se muestran una sola vez. Docentes administran clases desde un panel protegido; los estudiantes acceden con sus credenciales.
- La ruleta es una actividad formativa inicial; no guarda progreso ni genera calificaciones ni registros de desempeño.
- Migración SQL: migrations/0001_autenticacion.sql. Ejecutarla manualmente en una base D1 nueva y específica del proyecto; no reutilizar la D1 de otro OVA.
- En Cloudflare Pages > Settings > Bindings, añadir binding D1 con nombre exacto DB, seleccionar esa base y realizar un nuevo despliegue. En Settings > Variables and Secrets establecer ADMIN_SETUP_KEY como secreto, disponible en producción, y volver a desplegar.
- Hasta completar estos pasos, la interfaz mostrará un mensaje de configuración pendiente. NO se deben prometer cuentas funcionales antes de probar el acceso real.
- No se almacenan nombres reales, documentos de identidad ni calificaciones. La implementación para uso con menores requiere revisión de privacidad, autorizaciones institucionales y políticas de retención.


## Acceso simplificado y seguimiento (versión 0.6)

El registro y acceso de estudiantes y docentes exige un PIN numérico de exactamente 4 dígitos. Los usuarios se identifican con seudónimo de 4 a 24 caracteres. El PIN se almacena mediante un hash PBKDF2 con sal aleatoria, sin guardar el PIN en texto claro.

Se retiró el bloqueo temporal de cuentas por intentos fallidos. ADVERTENCIA: un PIN de cuatro dígitos ofrece solamente 10 000 combinaciones y es débil para una web pública. Antes de habilitarlo con estudiantes reales, deben incorporarse medidas contra intentos automatizados mediante las opciones de seguridad de Cloudflare, limitando el sistema a datos formativos no sensibles.

En el panel docente, Gestión de estudiantes permite editar el nombre de usuario, generar un PIN nuevo de cuatro dígitos y eliminar la cuenta. El PIN nuevo se muestra una sola vez, las sesiones antiguas se revocan y las respuestas de aprendizaje permanecen asociadas a la misma cuenta. La eliminación de una cuenta es irreversible y borra su historial. El servidor comprueba que cada estudiante pertenece a una clase del docente autenticado.

## Persistencia del progreso

La migración migrations/0002_progreso.sql crea la tabla activity_progress sin modificar ni eliminar datos en las cuatro tablas anteriores. Debe ejecutarse en la consola de la base D1 ova-coasociacion-db.

La página principal utiliza progress.js para recuperar y guardar automáticamente las respuestas a las dos preguntas, las tres reflexiones abiertas y los niveles de autoevaluación. También tiene el botón Guardar avance. Sin sesión iniciada, la actividad es pública y no almacena respuestas en D1. Con una sesión iniciada, los datos se vinculan con el identificador interno de la cuenta. Restablecer el PIN conserva el identificador y por tanto mantiene el progreso.

Antes de usar este sistema con menores, obtener las aprobaciones institucionales necesarias, definir conservación de datos y verificar una protección antiautomatización. No pedir nombres reales, documentos, calificaciones oficiales ni información sensible.


## Multi-docencia y privacidad de grupos (versión 0.7)

El primer docente se activa una sola vez con ADMIN_SETUP_KEY y se convierte en coordinador; puede generar invitaciones de un solo uso con vigencia de 72 horas desde su panel. Un docente invitado entra a la pantalla "Crear cuenta docente" e introduce nombre de usuario, PIN numérico de cuatro dígitos y código temporal. No se comparte la clave de activación inicial.

**Es obligatoria la migración migrations/0003_invitaciones_docentes.sql** en D1 para generar o consumir invitaciones. Cada docente crea grupos desde su panel; los estudiantes se vinculan con el código de clase. La API devuelve únicamente alumnos de los grupos del docente autenticado. La consulta de progreso de cada estudiante usa el mismo control de propiedad y no da acceso a estudiantes de otros docentes. El acceso del estudiante a su propio progreso continúa limitado a su sesión.

El seguimiento requiere haber ejecutado también migrations/0002_progreso.sql. No se crean bases separadas por profesor; se comparten infraestructura y sitio web, con partición lógica estricta por identidad de docente y relaciones de clases. La separación depende de autorización en el servidor, no de ocultar elementos de la interfaz.

El acceso con PIN de cuatro dígitos no debe emplearse con datos sensibles sin protección adicional ante intentos automatizados. La aceptación institucional, avisos de privacidad y consentimiento o asentimiento cuando corresponda deben verificarse antes de utilizar usuarios reales menores de edad.
