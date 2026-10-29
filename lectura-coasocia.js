
/* ---------- CONTENIDO ---------- */
const APR = [
 {id:"A1", nivel:"Literal", t:"Identifica y entiende los contenidos locales que conforman un texto.",
  idea:"Leer con precisión lo que el texto dice: el sentido de palabras y frases, los hechos y los personajes. Es la base de los otros dos aprendizajes: sin comprensión local no hay interpretación ni crítica.",
  aula:"En coasociación, los socios reconstruyen juntos el contenido explícito y se corrigen entre pares antes de pasar a interpretar."},
 {id:"A2", nivel:"Inferencial", t:"Comprende cómo se articulan las partes de un texto para darle un sentido global.",
  idea:"Leer las conexiones: cómo se relacionan párrafos, voces, ideas y elementos gráficos para construir el sentido completo, incluso lo que el texto no dice de forma directa.",
  aula:"Los equipos arman y desarman textos, mapean relaciones y explican a otros cómo llegaron a su interpretación."},
 {id:"A3", nivel:"Crítico", t:"Reflexiona a partir de un texto y evalúa su contenido.",
  idea:"Leer con juicio propio: evaluar la validez de lo que se afirma, reconocer valores y estrategias, situar el texto en su contexto y ponerlo en diálogo con otros textos.",
  aula:"Los socios debaten, contrastan fuentes y toman postura con argumentos, como agentes que transforman la información que circula en su comunidad."}
];
const EV = [
 {id:"E1.1",a:"A1",short:"Significado de elementos locales",t:"Entiende el significado de los elementos locales que constituyen un texto.",
  idea:"Reconoce el sentido de palabras, expresiones, signos y frases en el contexto donde aparecen, sin salir del texto.",
  des:["Deduce el significado de una palabra a partir del contexto.","Identifica a qué se refiere un pronombre o una expresión (referentes).","Interpreta signos de puntuación, conectores y expresiones figuradas."],
  co:{t:"Diccionario de socios",d:"Cada equipo propone el significado de cinco palabras desconocidas usando solo el contexto y después lo contrasta con el diccionario."},
  q:"En el texto, la expresión «…» puede reemplazarse, sin cambiar su sentido, por…"},
 {id:"E1.2",a:"A1",short:"Eventos y personajes explícitos",t:"Identifica los eventos narrados de manera explícita en un texto (literario, descriptivo, caricatura o cómic) y los personajes involucrados (si los hay).",
  idea:"Recupera qué pasa, quién lo hace, dónde y cuándo, tal como aparece dicho en el texto o mostrado en las viñetas.",
  des:["Ordena cronológicamente los hechos narrados.","Identifica a los personajes y sus acciones.","Ubica el tiempo y el lugar de los hechos."],
  co:{t:"Línea de tiempo humana",d:"Cada estudiante recibe una tarjeta con un evento, el grupo se ordena físicamente y el relator verifica el orden con el texto."},
  q:"Según el relato, ¿qué hace el personaje inmediatamente después de…?"},
 {id:"E2.1",a:"A2",short:"Estructura formal y función de las partes",t:"Comprende la estructura formal de un texto y la función de sus partes.",
  idea:"Reconoce cómo está organizado un texto (inicio, nudo y desenlace; tesis, argumentos y conclusión; estrofas; secciones de un manual) y para qué sirve cada parte.",
  des:["Identifica la superestructura según el tipo de texto.","Explica la función de un párrafo dentro del conjunto.","Reconoce títulos, subtítulos y otros paratextos."],
  co:{t:"Texto rompecabezas",d:"Los párrafos de un texto llegan desordenados; el equipo lo reconstruye y justifica la función de cada parte."},
  q:"El tercer párrafo del texto cumple la función de…"},
 {id:"E2.2",a:"A2",short:"Voces y situaciones del texto",t:"Identifica y caracteriza las diferentes voces o situaciones presentes en un texto.",
  idea:"Distingue quién habla (narrador, personajes, autor, fuentes citadas), desde qué punto de vista y en qué situación comunicativa.",
  des:["Distingue la voz del narrador de la de los personajes.","Identifica citas y fuentes dentro del texto.","Reconoce el tipo de narrador y su punto de vista."],
  co:{t:"Lectura a varias voces",d:"El equipo lee en voz alta con un lector por cada voz y luego explica qué rasgos distinguen a cada una."},
  q:"En el fragmento, la frase «…» corresponde a la voz de…"},
 {id:"E2.3",a:"A2",short:"Relaciones entre partes o enunciados",t:"Comprende las relaciones entre diferentes partes o enunciados de un texto.",
  idea:"Establece relaciones de causa y efecto, oposición, ejemplificación, secuencia o conclusión entre oraciones y párrafos, apoyándose en conectores y en el sentido.",
  des:["Identifica el tipo de relación que marca un conector.","Relaciona una afirmación con el ejemplo que la sustenta.","Infiere relaciones no explícitas entre párrafos."],
  co:{t:"Puentes lógicos",d:"Un socio dice un enunciado, el otro lo continúa con el conector asignado (sin embargo, por lo tanto, por ejemplo) y el equipo valida la coherencia."},
  q:"La relación entre el primer y el segundo enunciado es de…"},
 {id:"E2.4",a:"A2",short:"Ideas de un texto informativo",t:"Identifica y caracteriza las ideas o afirmaciones presentes en un texto informativo.",
  idea:"Reconoce la idea principal, las ideas secundarias y los datos que las respaldan en textos expositivos, descriptivos o argumentativos.",
  des:["Formula la idea principal con sus propias palabras.","Distingue las ideas principales de los detalles.","Diferencia hechos de opiniones."],
  co:{t:"Resumen en un mensaje",d:"Cada socio resume el texto en un mensaje de 280 caracteres; el equipo elige el que mejor conserva la idea principal y explica por qué."},
  q:"¿Cuál de los siguientes enunciados resume mejor la idea central del texto?"},
 {id:"E2.5",a:"A2",short:"Relaciones en textos discontinuos",t:"Identifica el tipo de relación existente entre diferentes elementos de un texto (discontinuo).",
  idea:"Integra imágenes, cifras, tablas, títulos, íconos y textos breves para comprender lo que comunican en conjunto: comparaciones, proporciones, tendencias o secuencias.",
  des:["Lee filas, columnas, escalas y convenciones.","Relaciona imagen y texto en una infografía o publicidad.","Identifica tendencias y comparaciones en los datos."],
  co:{t:"Infografía inversa",d:"Un equipo convierte un texto continuo en infografía, otro equipo la lee y reconstruye el mensaje, y luego comparan."},
  q:"Según la tabla, ¿qué relación existe entre…?"},
 {id:"E3.1",a:"A3",short:"Validez e implicaciones de un enunciado",t:"Establece la validez e implicaciones de un enunciado de un texto (argumentativo o expositivo).",
  idea:"Evalúa si una afirmación está bien sustentada, si su razonamiento es coherente y qué consecuencias se derivan de aceptarla.",
  des:["Distingue argumentos sólidos de falacias.","Evalúa si la evidencia es suficiente y pertinente.","Deduce las consecuencias de una afirmación."],
  co:{t:"Abogado del diablo",d:"Un socio defiende la afirmación, otro busca su punto débil y el equipo dictamina si es válida."},
  q:"¿Cuál de las siguientes afirmaciones debilita el argumento del autor?"},
 {id:"E3.2",a:"A3",short:"Relación con otros textos",t:"Establece relaciones entre un texto y otros textos o enunciados.",
  idea:"Compara un texto con otros, del mismo o de distinto formato, para hallar coincidencias, contradicciones, complementos o posturas diferentes sobre un tema.",
  des:["Identifica si dos textos coinciden o se oponen.","Reconoce qué enunciado externo apoya o refuta el texto.","Relaciona el texto con saberes de otras áreas."],
  co:{t:"Diálogo de textos",d:"Cada socio lee un texto distinto sobre el mismo tema y juntos elaboran un cuadro de coincidencias y diferencias."},
  q:"¿Cuál de los siguientes enunciados coincide con la postura del autor?"},
 {id:"E3.3",a:"A3",short:"Contenidos valorativos",t:"Reconoce contenidos valorativos presentes en un texto.",
  idea:"Identifica juicios, creencias, prejuicios, ideologías y valores que el texto expresa o supone, aunque no los diga de forma directa.",
  des:["Identifica adjetivos y expresiones que valoran.","Reconoce estereotipos o prejuicios.","Infiere los valores que el autor promueve."],
  co:{t:"Lupa de valores",d:"Los equipos subrayan con colores las expresiones valorativas (positivas, negativas, prejuicios) y debaten si son justas."},
  q:"La expresión «…» revela que quien habla considera que…"},
 {id:"E3.4",a:"A3",short:"Estrategias discursivas",t:"Reconoce las estrategias discursivas en un texto.",
  idea:"Identifica los recursos que usa el autor para persuadir, informar o conmover: ejemplos, cifras, preguntas retóricas, ironía, testimonios, apelación a la emoción o a la autoridad.",
  des:["Nombra la estrategia usada en un fragmento.","Explica el efecto que busca en el lector.","Distingue persuasión de demostración."],
  co:{t:"Agencia de publicidad",d:"Cada equipo crea un anuncio con dos estrategias secretas y el resto del curso debe descubrirlas."},
  q:"Al incluir el testimonio de una experta, el autor busca…"},
 {id:"E3.5",a:"A3",short:"Contextualización del texto",t:"Contextualiza adecuadamente un texto o la información contenida en él.",
  idea:"Ubica el texto en su contexto de producción y circulación (quién lo escribe, para quién, cuándo, dónde y con qué propósito) para interpretarlo mejor.",
  des:["Identifica el propósito y el público del texto.","Reconoce el contexto histórico, social o cultural.","Explica cómo cambia el sentido en otro contexto."],
  co:{t:"Ficha de contexto",d:"Antes de leer, los socios averiguan autor, fecha y medio de publicación; después explican cómo esos datos cambian su lectura."},
  q:"Por su formato y lenguaje, este texto probablemente fue escrito para…"}
];
const evById = Object.fromEntries(EV.map(e=>[e.id,e]));

const POOL = {
 A1:[
  {tx:"El bocachico remonta el río durante la subienda, entre enero y marzo.",q:"Según el texto, ¿cuándo ocurre la subienda?",o:["Entre enero y marzo","Entre octubre y diciembre","Durante todo el año"],c:0,why:"El dato aparece explícito: «entre enero y marzo»."},
  {tx:"Rosa le prestó el libro a Julián, pero él lo olvidó en el bus.",q:"¿Quién olvidó el libro?",o:["Rosa","Julián","El conductor del bus"],c:1,why:"El pronombre «él» se refiere a Julián, el último personaje masculino mencionado."},
  {tx:"La propuesta fue acogida con beneplácito por el consejo directivo.",q:"La palabra «beneplácito» significa:",o:["Rechazo","Indiferencia","Aprobación y agrado"],c:2,why:"«Acogida» indica recepción favorable; por contexto, beneplácito es aprobación."},
  {tx:"Primero se lava la semilla, luego se seca al sol y por último se guarda en frascos.",q:"¿Qué se hace después de lavar la semilla?",o:["Se seca al sol","Se guarda en frascos","Se siembra"],c:0,why:"El conector «luego» marca el paso siguiente: secarla al sol."},
  {tx:"El sombrero vueltiao, símbolo del Caribe colombiano, se teje con fibra de caña flecha.",q:"¿Con qué material se teje el sombrero, según el texto?",o:["Palma de iraca","Caña flecha","Algodón"],c:1,why:"El texto lo dice de forma literal: «fibra de caña flecha»."}
 ],
 A2:[
  {tx:"Llovió toda la noche. Por eso, la clase de Educación Física se hizo en el salón.",q:"¿Qué relación hay entre las dos oraciones?",o:["Oposición","Causa y consecuencia","Ejemplificación"],c:1,why:"«Por eso» introduce la consecuencia de la lluvia."},
  {tx:"El proyecto parecía imposible; sin embargo, el grupo lo terminó a tiempo.",q:"El conector «sin embargo» expresa:",o:["Contraste","Adición","Conclusión"],c:0,why:"Opone lo esperado (imposible) a lo que pasó (lo terminaron)."},
  {tx:"—Ya voy —gritó Mario desde la cocina.",q:"«gritó Mario desde la cocina» corresponde a la voz de:",o:["Mario","El narrador","Un lector"],c:1,why:"Las rayas separan lo que dice el personaje de la acotación del narrador."},
  {tx:"Grado 10.º: 32 estudiantes, 20 leen a diario. Grado 11.º: 30 estudiantes, 24 leen a diario.",q:"¿Qué grado tiene mayor proporción de lectores diarios?",o:["10.º","11.º","Tienen la misma proporción"],c:1,why:"11.º: 24 de 30 (80 %). 10.º: 20 de 32 (62,5 %)."},
  {tx:"La fotosíntesis transforma la luz en energía química. Gracias a ella, las plantas producen su alimento y liberan oxígeno.",q:"¿Cuál es la idea principal?",o:["Las plantas son verdes","La fotosíntesis permite a las plantas producir alimento y oxígeno","La luz es una forma de energía"],c:1,why:"Las demás opciones son detalles o ideas que el texto no desarrolla."}
 ],
 A3:[
  {tx:"Anuncio: «9 de cada 10 odontólogos recomiendan la crema dental Sonrisa+».",q:"¿Qué estrategia discursiva usa el anuncio?",o:["Apelación a la autoridad con cifras","Pregunta retórica","Ironía"],c:0,why:"Usa a expertos y un dato numérico para dar credibilidad."},
  {tx:"«Todos los jóvenes de hoy son perezosos; mi sobrino no hace nada en todo el día».",q:"¿Cuál es el problema de este argumento?",o:["Usa datos confiables","Generaliza a partir de un solo caso","Cita a expertos"],c:1,why:"Saca una conclusión sobre todos a partir de un ejemplo: generalización apresurada."},
  {tx:"«Los valientes campesinos sostienen con su esfuerzo la mesa de todo el país».",q:"¿Qué valoración expresa el enunciado?",o:["Desprecio por el campo","Admiración por el trabajo campesino","Una postura neutral"],c:1,why:"«Valientes» y «sostienen la mesa del país» son expresiones de reconocimiento."},
  {tx:"Mensaje sin autor ni fecha: «¡Urgente! Mañana cierran todos los colegios de Córdoba. Compártelo».",q:"¿Qué es lo más prudente frente a este mensaje?",o:["Compartirlo porque es urgente","Creerlo porque muchos lo comparten","Verificarlo en fuentes oficiales antes de compartir"],c:2,why:"Sin autor, fecha ni fuente, el mensaje no se puede contextualizar ni validar."},
  {tx:"Texto A: «El reciclaje reduce la basura que llega a los rellenos». Texto B: «Separar los residuos en casa permite reciclar más material».",q:"¿Qué relación hay entre los dos textos?",o:["B contradice a A","B complementa a A","No tienen relación"],c:1,why:"B explica una condición que hace posible lo que afirma A."}
 ]
};
const ORAL = [
 "Explica a tu socio, en 30 segundos, la idea central del último texto que leyeron en clase.",
 "Inventa un titular engañoso; tu socio debe decir por qué engaña.",
 "Describe una publicidad que hayas visto hoy y nombra dos estrategias que usa.",
 "Cuenta una noticia de Cereté en tres eventos; tu socio debe repetirlos en orden.",
 "Di una opinión sobre el colegio; tu socio debe responder empezando con «sin embargo…».",
 "Elige una palabra difícil de la clase y explica su significado solo con el contexto."
];

const RETOS = [
 {id:"r1",a:"A1",t:"Glosario vivo del Sinú",
  idea:"La memoria de la comunidad",pe:"¿Qué palabras y relatos de nuestra región corren el riesgo de olvidarse?",
  reto:"Crear un glosario ilustrado y una línea de tiempo de un relato tradicional contado por un mayor de la comunidad.",
  ev:["E1.1","E1.2"],tiempo:"4 sesiones de 55 min",producto:"Glosario ilustrado y línea de tiempo entregados a la biblioteca escolar",
  roles:"Entrevistador, transcriptor, ilustrador, vocero",
  fases:[
   {n:"Involucrar",p:["Leer en clase un relato regional y subrayar las palabras desconocidas.","Acordar roles y el mayor a quien entrevistarán."]},
   {n:"Investigar",p:["Entrevistar al mayor y grabar o transcribir su relato.","Seleccionar 10 palabras o expresiones locales y deducir su significado por el contexto.","Identificar los eventos, personajes, tiempo y lugar del relato."]},
   {n:"Actuar",p:["Diseñar el glosario, en papel o digital, con ejemplos de uso.","Presentar la línea de tiempo al curso.","Entregar una copia a la biblioteca y otra al entrevistado."]}
  ],
  crit:["Los significados se deducen del contexto y se verifican.","Los eventos están en orden y con sus personajes.","El producto respeta la voz del entrevistado."]},
 {id:"r2",a:"A2",t:"Arquitectos del sentido",
  idea:"El sentido se construye con conexiones",pe:"¿Cómo explicamos un tema complejo para que cualquiera lo entienda?",
  reto:"Transformar un texto expositivo de Ciencias o Sociales en una infografía para estudiantes de 6.º y validarla con ellos.",
  ev:["E2.1","E2.2","E2.3","E2.4","E2.5"],tiempo:"5 sesiones de 55 min",producto:"Infografía validada por estudiantes de 6.º",
  roles:"Analista del texto, diseñador, investigador de fuentes, probador, vocero",
  fases:[
   {n:"Involucrar",p:["Analizar dos infografías y discutir qué las hace claras.","Elegir el texto fuente con el docente de Ciencias o Sociales."]},
   {n:"Investigar",p:["Mapear la estructura del texto y la función de cada párrafo.","Identificar la idea principal, las secundarias, las voces citadas y los conectores.","Decidir qué relaciones (causa, comparación, secuencia) mostrar con elementos gráficos."]},
   {n:"Actuar",p:["Diseñar la infografía.","Probarla con cinco estudiantes de 6.º: ¿entendieron la idea central?","Ajustarla según la retroalimentación y exponerla."]}
  ],
  crit:["La infografía conserva la idea central y la jerarquía de ideas.","Los elementos gráficos muestran relaciones correctas.","Los cambios responden a la prueba con usuarios."]},
 {id:"r3",a:"A3",t:"Verificadores de Cereté",
  idea:"La información y la comunidad",pe:"¿Cómo protegemos a nuestra comunidad de la desinformación?",
  reto:"Analizar tres piezas que circulan en redes o en el barrio (publicidad, cadena, noticia) y producir una campaña «Antes de compartir, verifica».",
  ev:["E3.1","E3.2","E3.3","E3.4","E3.5"],tiempo:"6 sesiones de 55 min",producto:"Campaña en la emisora escolar o en los grupos de familias, con aval docente",
  roles:"Verificador, analista de estrategias, redactor, diseñador, vocero",
  fases:[
   {n:"Involucrar",p:["Traer piezas que hayan recibido en casa o en redes.","Votar cuáles tres analizar."]},
   {n:"Investigar",p:["Contextualizar cada pieza: autor, fecha, propósito y público.","Evaluar la validez de sus afirmaciones y contrastarlas con otras fuentes.","Identificar contenidos valorativos y estrategias discursivas."]},
   {n:"Actuar",p:["Crear la campaña: afiches, audios o mensajes.","Difundirla con aval del docente.","Medir su alcance con una encuesta breve a familias."]}
  ],
  crit:["Cada juicio de validez se apoya en fuentes contrastadas.","Se nombran con precisión las estrategias y los valores de cada pieza.","La campaña es clara, respetuosa y útil para la comunidad."]}
];

const CASES = [
 {id:"c1",t:"La canoa de Tomasa",kind:"Continuo literario · cuento",short:"Cuento",
  html:`<p>Cuando el Sinú creció aquel octubre, Tomasa amarró la canoa al tamarindo del patio y se quedó despierta toda la noche, oyendo cómo el agua lamía los escalones de la casa. Su abuelo, que había visto más crecientes que años tenía el pueblo, le dijo antes de dormirse: —El río no es bravo, mija; es que tiene memoria y vuelve a buscar lo que fue suyo.</p>
  <p>Al amanecer, el patio era una lámina parda. Tomasa soltó la canoa y remó hasta la casa de los Arrieta, donde doña Ermelinda esperaba en el techo con sus tres nietos y una gallina envuelta en una toalla. Hizo cuatro viajes hasta la escuela, que estaba en lo alto y servía de albergue.</p>
  <p>En el último viaje, ya con los brazos entumecidos, entendió la frase del abuelo: el río había vuelto a ocupar las ciénagas que la gente había rellenado para construir. Esa tarde, en el albergue, Tomasa no habló de la creciente sino de las ciénagas.</p>
  <p class="note">Texto original escrito para este ejercicio.</p>`,
  qs:[
   {e:"E1.1",q:"En la expresión «el patio era una lámina parda», la palabra «lámina» se refiere a:",o:["Una hoja de metal que cubría el patio","Una capa extensa y plana de agua turbia","Un dibujo del patio","Una tabla del piso"],c:1,why:"El contexto (creciente, agua en los escalones) indica que el patio quedó cubierto por una superficie plana de agua color pardo."},
   {e:"E1.2",q:"¿Qué hizo Tomasa al amanecer?",o:["Amarró la canoa al tamarindo","Se subió al techo con doña Ermelinda","Remó hasta la casa de los Arrieta e hizo cuatro viajes hasta la escuela","Habló con el abuelo sobre las ciénagas"],c:2,why:"Amarrar la canoa ocurrió la noche anterior; al amanecer remó y llevó a la familia a la escuela."},
   {e:"E2.1",q:"El último párrafo cumple la función de:",o:["Presentar a los personajes","Describir el inicio de la creciente","Cerrar el relato con la comprensión que alcanza la protagonista","Plantear un conflicto nuevo sin resolver"],c:2,why:"Es el desenlace: Tomasa comprende la frase del abuelo y cambia su forma de ver la creciente."}
  ],
  disc:"El abuelo dice que el río «tiene memoria». ¿Qué responsabilidad tiene la comunidad en las inundaciones? ¿Qué propondrían ustedes como socios del barrio?"},
 {id:"c2",t:"La huerta del consejo",kind:"Discontinuo literario · cómic",short:"Cómic",
  html:`<div class="comic">
   <div class="panel"><span class="n">Viñeta 1</span><div class="cartela">Lunes, 7:00 a. m. El consejo estudiantil discute qué hacer con el patio trasero.</div><div class="bubble"><b>VALERIA</b>¡Propongo una huerta escolar!</div></div>
   <div class="panel"><span class="n">Viñeta 2</span><div class="scene">Andrés cruza los brazos.</div><div class="bubble"><b>ANDRÉS</b>¿Una huerta? Eso es cosa de campesinos. Mejor una cancha.</div></div>
   <div class="panel"><span class="n">Viñeta 3</span><div class="scene">Valeria señala un mural con frutas y hortalizas.</div><div class="bubble"><b>VALERIA</b>Mi abuelo es campesino y gracias a gente como él comemos todos. Además, la huerta nos sirve para Ciencias y Matemáticas.</div></div>
   <div class="panel"><span class="n">Viñeta 4</span><div class="cartela">Dos semanas después…</div><div class="scene">Andrés riega unas matas de ají.</div><div class="bubble"><b>ANDRÉS</b>Bueno… la cancha puede esperar.</div></div>
  </div><p class="note">Cómic original escrito para este ejercicio.</p>`,
  qs:[
   {e:"E2.2",q:"Los textos «Lunes, 7:00 a. m.…» y «Dos semanas después…» corresponden a:",o:["La voz de Andrés","Los pensamientos de Valeria","La voz de un narrador que sitúa el tiempo y el lugar","Las palabras del rector"],c:2,why:"Las cartelas son la voz del narrador en el cómic; los globos son la voz de los personajes."},
   {e:"E2.3",q:"Entre las viñetas 3 y 4 se establece una relación de:",o:["Causa y consecuencia: los argumentos de Valeria llevan a que la huerta se haga y Andrés cambie de posición","Oposición: Andrés rechaza definitivamente la huerta","Ejemplificación de la viñeta 1","Simultaneidad: ocurren al mismo tiempo"],c:0,why:"La cartela «dos semanas después» y la acción de Andrés muestran el efecto de los argumentos de Valeria."},
   {e:"E3.3",q:"La expresión de Andrés «Eso es cosa de campesinos» revela:",o:["Un dato técnico sobre agricultura","Un prejuicio que desvaloriza el trabajo del campo","Admiración por los campesinos","Un argumento basado en evidencia"],c:1,why:"Usa «campesinos» como algo menor: es un juicio valorativo negativo que Valeria refuta."}
  ],
  disc:"¿Qué otros prejuicios sobre el campo o la región han escuchado? Reescriban la viñeta 2 para que Andrés defienda la cancha con un argumento respetuoso."},
 {id:"c3",t:"Celulares en el aula: prohibir no es educar",kind:"Continuo informativo · columna de opinión",short:"Columna",
  html:`<p>Cada año alguien propone prohibir los celulares en los colegios, como si el problema fuera el aparato y no el uso. Prohibir es fácil; enseñar a usarlo es difícil, y por eso es trabajo de la escuela.</p>
  <p>Un estudiante que aprende a verificar una noticia, a citar una fuente o a grabar un pódcast con su teléfono está desarrollando habilidades que necesitará en cualquier oficio. ¿Vamos a negarle esa oportunidad porque algunos se distraen con los juegos?</p>
  <p>Claro que el celular distrae. También distraen la ventana, el compañero y el sueño. La respuesta no es tapiar la ventana, sino hacer que la clase valga la pena. Lo sensato es un pacto: momentos con celular para aprender y momentos sin él para conversar.</p>
  <p>Como dice una docente con veinte años de experiencia en Córdoba: «Lo que se prohíbe se vuelve más atractivo; lo que se acuerda se cuida».</p>
  <p class="note">Columna original escrita para este ejercicio.</p>`,
  qs:[
   {e:"E3.1",q:"¿Cuál de estos hallazgos debilitaría más el argumento del autor?",o:["Muchos estudiantes de Córdoba tienen celular","Algunos docentes usan pódcast en sus clases","Un estudio en la misma institución muestra que, aun con acuerdos de uso, el rendimiento bajó cuando se permitió el celular en clase","La ventana del salón también distrae"],c:2,why:"Contradice directamente la tesis de que el pacto de uso resuelve el problema."},
   {e:"E3.4",q:"La pregunta «¿Vamos a negarle esa oportunidad…?» es:",o:["Una solicitud de información al lector","Una pregunta retórica que busca que el lector acepte la postura","Un dato estadístico","Una cita de autoridad"],c:1,why:"No espera respuesta: la respuesta «no» está implícita y refuerza la tesis."},
   {e:"E3.2",q:"¿Cuál de estos enunciados coincide con la postura del autor?",o:["«La tecnología en la escuela debe enseñarse con criterio, no esconderse»","«Las aulas deben estar libres de pantallas»","«La disciplina escolar depende de prohibiciones claras»","«El celular solo sirve para entretener»"],c:0,why:"El autor defiende enseñar a usar el celular mediante un pacto, no prohibirlo."}
  ],
  disc:"Escriban en equipo un párrafo que refute la columna. Después decidan: ¿qué pacto de uso del celular propondrían para su curso?"},
 {id:"c4",t:"¿Cuánta agua usamos en casa?",kind:"Discontinuo informativo · infografía",short:"Infografía",
  html:`<p><b>Campaña «Cada gota cuenta»</b> · Comité ambiental escolar</p>
  <div class="info" id="info"></div>
  <div class="tip">Cerrar la llave mientras te cepillas ahorra más de 11 litros cada vez. ¡Comparte este dato en casa!</div>
  <p class="note">Datos aproximados e ilustrativos, elaborados para este ejercicio. Las barras claras muestran la práctica ahorradora.</p>`,
  qs:[
   {e:"E2.5",q:"Según la infografía, ¿qué relación hay entre lavar los platos con la llave abierta y hacerlo con un recipiente?",o:["Usan la misma cantidad de agua","Con la llave abierta se usa el doble","Con la llave abierta se usa cuatro veces más agua","Con el recipiente se usa más agua"],c:2,why:"60 litros frente a 15 litros: 60 ÷ 15 = 4."},
   {e:"E2.4",q:"¿Cuál es la idea central de la infografía?",o:["La ducha es la actividad más importante del día","Pequeños cambios de hábito en casa reducen mucho el consumo de agua","El inodoro gasta 10 litros por descarga","Cepillarse con vaso es más higiénico"],c:1,why:"Todas las comparaciones y el mensaje final apuntan a cambiar hábitos para ahorrar agua."},
   {e:"E3.5",q:"Por su formato y lenguaje, esta infografía fue elaborada probablemente para:",o:["Un informe técnico dirigido a ingenieros","Una campaña escolar dirigida a estudiantes y familias","Un anuncio para vender llaves de agua","Una obra literaria"],c:1,why:"La firma del comité escolar, el tuteo y el llamado «¡Comparte este dato en casa!» indican su público y propósito."}
  ],
  disc:"¿Qué datos reales de su casa o del colegio podrían medir para una infografía propia? Planeen cómo recogerlos durante una semana."}
];
const INFO = [["Ducha de 10 minutos",90,0],["Lavar platos con la llave abierta",60,0],["Lavar platos con recipiente",15,1],["Cepillarse con la llave abierta",12,0],["Descarga del inodoro",10,0],["Cepillarse con un vaso",0.5,1]];

const BADGES = [
 {id:"lector",m:"LL",a:"A1",n:"Lector local",d:"3 aciertos de nivel literal"},
 {id:"arquitecto",m:"AS",a:"A2",n:"Arquitecto del sentido",d:"3 aciertos de nivel inferencial"},
 {id:"critica",m:"VC",a:"A3",n:"Voz crítica",d:"3 aciertos de nivel crítico"},
 {id:"emparejador",m:"SE",n:"Socio emparejador",d:"Completa una ronda de emparejamiento"},
 {id:"racha",m:"R5",n:"Racha de cinco",d:"5 respuestas correctas seguidas"},
 {id:"detective",m:"DC",n:"Detective de casos",d:"Responde completo un estudio de caso"},
 {id:"retador",m:"RT",n:"Retador",d:"Completa todas las etapas de un reto"},
 {id:"integral",m:"LI",n:"Lector integral",d:"Gana las otras siete insignias"}
];

/* ---------- ESTADO ---------- */
const fresh=()=>({points:0,streak:0,best:0,correct:{A1:0,A2:0,A3:0},rounds:0,cases:{},retos:{},badges:[],refl:{}});
let S=fresh(),stateReady=false,dirty=false,saving=false,saveTimer;
function syncStatus(message,isError=false){
 const n=document.querySelector("#sync-status");
 if(n){n.textContent=message;n.classList.toggle("error",isError);}
}
function save(){
 dirty=true;
 if(!stateReady)return;
 clearTimeout(saveTimer);
 saveTimer=setTimeout(flush,500);
}
async function flush(){
 if(!dirty||saving||!stateReady)return;
 dirty=false;saving=true;
 syncStatus("Guardando en tu cuenta…");
 let succeeded=false;
 try{
  const res=await fetch("/api/reading-progress",{method:"POST",credentials:"same-origin",
   cache:"no-store",headers:{"content-type":"application/json"},body:JSON.stringify({progress:S})});
  const data=await res.json();
  if(!res.ok||!data.ok)throw Error(data.error||"No se pudo guardar");
  succeeded=true;
 }catch(e){dirty=true;syncStatus("Error al guardar. Reintenta realizando un cambio.",true)}
 finally{saving=false;if(succeeded){syncStatus("Avance guardado en tu cuenta");if(dirty)save()}}
}
async function hydrate(){
 try{
  const res=await fetch("/api/reading-progress",{credentials:"same-origin",cache:"no-store"});
  if(res.status===401){location.replace("/acceso.html");return;}
  const data=await res.json();
  if(!res.ok||!data.ok)throw Error(data.error||"Error de lectura");
  if(data.progress){
   S=Object.assign(fresh(),data.progress);
   S.correct=Object.assign({A1:0,A2:0,A3:0},data.progress.correct||{});
  }
  stateReady=true;
  syncStatus("Avance individual sincronizado");
  document.querySelector("#reading-main").hidden=false;
  hydrate();
 }catch(e){syncStatus("No fue posible cargar tu avance; recarga la página.",true)}
}
addEventListener("pagehide",()=>{
 if(dirty&&stateReady)fetch("/api/reading-progress",{method:"POST",credentials:"same-origin",keepalive:true,
  headers:{"content-type":"application/json"},body:JSON.stringify({progress:S})}).catch(()=>{});
});
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const L="ABCD";

function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove("show"),2600)}
function hud(){ $("#hud-pts").textContent=S.points; $("#hud-streak").textContent=S.streak; $("#hud-badges").textContent=S.badges.length+"/"+BADGES.length; }
function retoDone(r){const st=S.retos[r.id]||{};return r.fases.every((f,fi)=>f.p.every((_,pi)=>st[fi+"-"+pi]))}
function checkBadges(){
 const tests={lector:S.correct.A1>=3,arquitecto:S.correct.A2>=3,critica:S.correct.A3>=3,emparejador:S.rounds>=1,racha:S.best>=5,
  detective:Object.values(S.cases).some(c=>Object.keys(c).length>=3),retador:RETOS.some(retoDone)};
 const earned=[];
 for(const b of BADGES){ if(b.id==="integral") continue; if(tests[b.id]&&!S.badges.includes(b.id)){S.badges.push(b.id);earned.push(b.n)} }
 if(BADGES.filter(b=>b.id!=="integral").every(b=>S.badges.includes(b.id))&&!S.badges.includes("integral")){S.badges.push("integral");earned.push("Lector integral")}
 if(earned.length) toast("Insignia ganada: "+earned.join(", "));
 save(); hud(); if(!$("#v-insignias").hidden) renderBadges();
}
function award(level,ok,mult=1){
 if(ok){S.points+=10*mult;S.streak++;S.best=Math.max(S.best,S.streak);if(level)S.correct[level]++;}
 else S.streak=0;
 checkBadges();
}

/* ---------- MATRIZ ---------- */
function renderMatrix(){
 $("#matrix").innerHTML=APR.map(a=>`
  <article class="apr lv-${a.id}">
   <div class="apr-side"><span class="nivel">${a.nivel}</span><span class="eyebrow">Aprendizaje ${a.id.slice(1)}</span><h3>${esc(a.t)}</h3><p class="idea">${esc(a.idea)}</p><p class="howto">${esc(a.aula)}</p></div>
   <div class="ev-list">${EV.filter(e=>e.a===a.id).map(e=>`
    <details class="ev"><summary><span class="ev-code">${e.id}</span><span class="ev-title">${esc(e.t)}</span><span class="ev-plus" aria-hidden="true">+</span></summary>
     <div class="ev-body">
      <section class="full"><h4>Qué significa</h4><p>${esc(e.idea)}</p></section>
      <section><h4>Desempeños observables</h4><ul>${e.des.map(d=>`<li>${esc(d)}</li>`).join("")}</ul></section>
      <section><h4>Actividad de coasociación</h4><p><b>${esc(e.co.t)}.</b> ${esc(e.co.d)}</p></section>
      <section class="full"><h4>Modelo de pregunta</h4><p class="q">${esc(e.q)}</p></section>
     </div></details>`).join("")}</div>
  </article>`).join("");
}

/* ---------- EMPAREJAR ---------- */
const M={mode:"preg",items:[],right:[],selL:null,selR:null,done:new Set(),err:0};
function newRound(){M.items=shuffle(EV).slice(0,6);M.right=shuffle(M.items.map(e=>e.id));M.selL=M.selR=null;M.done=new Set();M.err=0;$("#m-done").innerHTML="";renderMatch()}
function rightText(e){return M.mode==="preg"?e.q:e.co.d}
function renderMatch(){
 $("#m-right-h").textContent=M.mode==="preg"?"Preguntas tipo":"Actividades de socios";
 $("#m-left").innerHTML=M.items.map(e=>`<button class="tile lv-${e.a} ${M.done.has(e.id)?"done":""}" data-l="${e.id}" aria-pressed="${M.selL===e.id}" ${M.done.has(e.id)?"disabled":""}><span class="num">${e.id}</span>${esc(e.short)}</button>`).join("");
 $("#m-right").innerHTML=M.right.map(id=>{const e=evById[id];return `<button class="tile lv-${e.a} ${M.done.has(id)?"done":""}" data-r="${id}" aria-pressed="${M.selR===id}" ${M.done.has(id)?"disabled":""}>${M.done.has(id)?`<span class="num">${id}</span>`:""}${esc(rightText(e))}</button>`}).join("");
 $("#m-status").textContent=`${M.done.size} de 6 parejas · ${M.err} intento${M.err===1?"":"s"} fallido${M.err===1?"":"s"}`;
}
function tryMatch(){
 if(!M.selL||!M.selR) return;
 if(M.selL===M.selR){M.done.add(M.selL);S.points+=5;save();hud();M.selL=M.selR=null;renderMatch();
  if(M.done.size===6){S.rounds++;checkBadges();$("#m-done").innerHTML=`<div class="banner"><b>Ronda completada.</b> ${M.err===0?"Sin errores: excelente trabajo de socios.":`Con ${M.err} intento${M.err===1?"":"s"} fallido${M.err===1?"":"s"}. Revisen en la matriz las evidencias que confundieron.`}</div>`}}
 else{M.err++;S.streak=0;save();hud();const l=document.querySelector(`[data-l="${M.selL}"]`),r=document.querySelector(`[data-r="${M.selR}"]`);[l,r].forEach(x=>x&&x.classList.add("shake"));
  setTimeout(()=>{M.selL=M.selR=null;renderMatch()},380);}
}
document.addEventListener("click",ev=>{
 const l=ev.target.closest("[data-l]"),r=ev.target.closest("[data-r]");
 if(l&&!l.disabled){M.selL=M.selL===l.dataset.l?null:l.dataset.l;renderMatch();tryMatch()}
 if(r&&!r.disabled){M.selR=M.selR===r.dataset.r?null:r.dataset.r;renderMatch();tryMatch()}
});
$("#m-preg").onclick=()=>{M.mode="preg";$("#m-preg").setAttribute("aria-pressed","true");$("#m-act").setAttribute("aria-pressed","false");newRound()};
$("#m-act").onclick=()=>{M.mode="act";$("#m-act").setAttribute("aria-pressed","true");$("#m-preg").setAttribute("aria-pressed","false");newRound()};
$("#m-new").onclick=newRound;

/* ---------- RULETA ---------- */
const SEGS=[{k:"A1",l:"Literal",c:"--lit"},{k:"A2",l:"Inferencial",c:"--inf"},{k:"A3",l:"Crítico",c:"--cri"},{k:"socio",l:"Comodín socio",c:"--seg4"},{k:"doble",l:"Doble puntaje",c:"--seg5"},{k:"oral",l:"Reto oral",c:"--seg6"}];
const cv=$("#wheel"),cx=cv.getContext("2d");let rot=0,spinning=false;const used={A1:[],A2:[],A3:[]};
const tok=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
function drawWheel(){
 const W=cv.width,R=W/2-8,a=2*Math.PI/SEGS.length;cx.clearRect(0,0,W,W);
 cx.save();cx.translate(W/2,W/2);cx.rotate(rot);
 SEGS.forEach((s,i)=>{cx.beginPath();cx.moveTo(0,0);cx.arc(0,0,R,i*a,(i+1)*a);cx.closePath();cx.fillStyle=tok(s.c);cx.fill();cx.strokeStyle=tok("--card");cx.lineWidth=4;cx.stroke();
  cx.save();cx.rotate(i*a+a/2);cx.fillStyle=tok("--on-seg");cx.font="700 30px "+tok("--f-body");cx.textAlign="right";cx.textBaseline="middle";cx.fillText(s.l,R-26,0);cx.restore();});
 cx.beginPath();cx.arc(0,0,52,0,2*Math.PI);cx.fillStyle=tok("--card");cx.fill();cx.strokeStyle=tok("--line");cx.lineWidth=3;cx.stroke();
 cx.restore();
 cx.fillStyle=tok("--ink");cx.font="800 30px "+tok("--f-display");cx.textAlign="center";cx.textBaseline="middle";cx.fillText("11°",W/2,W/2+2);
}
$("#legend").innerHTML=SEGS.map(s=>`<span><i style="background:var(${s.c})"></i>${s.l}</span>`).join("");
function pickItem(level){let pool=POOL[level].map((_,i)=>i).filter(i=>!used[level].includes(i));if(!pool.length){used[level]=[];pool=POOL[level].map((_,i)=>i)}const i=pool[Math.floor(Math.random()*pool.length)];used[level].push(i);return POOL[level][i]}
function spin(){
 if(spinning) return; spinning=true; $("#spin").disabled=true;
 const a=2*Math.PI/SEGS.length, idx=Math.floor(Math.random()*SEGS.length), c=idx*a+a/2;
 const target=rot+5*2*Math.PI+((((3*Math.PI/2-c-rot)%(2*Math.PI))+2*Math.PI)%(2*Math.PI));
 const start=rot,t0=performance.now(),dur=matchMedia("(prefers-reduced-motion: reduce)").matches?1:3200;
 const step=now=>{const p=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-p,4);rot=start+(target-start)*e;drawWheel();
  if(p<1) requestAnimationFrame(step); else {rot=target%(2*Math.PI);spinning=false;$("#spin").disabled=false;land(SEGS[idx])}};
 requestAnimationFrame(step);
}
function land(s){
 const card=$("#r-card");card.classList.remove("empty");card.className="qcard";
 if(s.k==="oral"){const p=ORAL[Math.floor(Math.random()*ORAL.length)];
  card.innerHTML=`<div class="tag-row"><span class="chip">Reto oral</span></div><p class="ask">${esc(p)}</p><p class="status">El docente o el equipo contrario valida si el reto se cumplió.</p><div class="tag-row"><button class="btn" id="oral-ok">Lo logramos (+10)</button><button class="btn ghost" id="oral-no">Pasar</button></div>`;
  $("#oral-ok").onclick=()=>{award(null,true);card.innerHTML=`<div class="fb ok"><b>+10 puntos.</b> Gira de nuevo para el siguiente equipo.</div>`};
  $("#oral-no").onclick=()=>{award(null,false);card.innerHTML=`<div class="fb no">Reto pasado. La racha vuelve a cero.</div>`};return;}
 let level=s.k,mult=1,note="";
 if(s.k==="doble"){level=["A1","A2","A3"][Math.floor(Math.random()*3)];mult=2;}
 if(s.k==="socio"){level=["A1","A2","A3"][Math.floor(Math.random()*3)];note=`<p class="howto">Comodín socio: discutan en pareja 30 segundos y respondan juntos. Si aciertan, ambos celebran.</p>`}
 const it=pickItem(level),a=APR.find(x=>x.id===level);
 card.classList.add("lv-"+level);
 card.innerHTML=`<div class="tag-row"><span class="chip">${a.nivel}</span>${mult>1?'<span class="mult">×2</span>':""}${s.k==="socio"?'<span class="chip" style="--lv:var(--seg4)">Comodín socio</span>':""}</div>${note}<blockquote>${esc(it.tx)}</blockquote><p class="ask">${esc(it.q)}</p><div class="opts">${it.o.map((o,i)=>`<button class="opt" data-i="${i}"><b>${L[i]}</b><span>${esc(o)}</span></button>`).join("")}</div><div id="r-fb"></div>`;
 card.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{const i=+b.dataset.i,ok=i===it.c;
  card.querySelectorAll(".opt").forEach(x=>{x.disabled=true;if(+x.dataset.i===it.c)x.classList.add("right")});if(!ok)b.classList.add("wrong");
  award(level,ok,mult);$("#r-fb").innerHTML=`<div class="fb ${ok?"ok":"no"}"><b>${ok?`Correcto. +${10*mult} puntos.`:"No es correcta."}</b> ${esc(it.why)}</div>`;});
}
$("#spin").onclick=spin;

/* ---------- RETOS ---------- */
function renderRetos(){
 $("#retos").innerHTML=RETOS.map(r=>{const st=S.retos[r.id]||{},total=r.fases.reduce((n,f)=>n+f.p.length,0),done=Object.values(st).filter(Boolean).length,ap=APR.find(x=>x.id===r.a);
  return `<article class="reto lv-${r.a}">
   <div class="reto-head"><div style="display:grid;gap:6px;min-width:0"><div class="tag-row"><span class="chip">${ap.nivel} · Aprendizaje ${r.a.slice(1)}</span>${r.ev.map(e=>`<span class="chip">${e}</span>`).join("")}</div><h3>${esc(r.t)}</h3></div><span class="pill">${done}/${total}</span></div>
   <div class="bar" aria-hidden="true"><i style="width:${Math.round(done/total*100)}%"></i></div>
   <div class="reto-meta">
    <div class="reto-q"><b>Gran idea</b>${esc(r.idea)}</div>
    <div class="reto-q"><b>Pregunta esencial</b>${esc(r.pe)}</div>
    <div class="reto-q"><b>El reto</b>${esc(r.reto)}</div>
   </div>
   <div class="fases">${r.fases.map((f,fi)=>`<div class="fase"><h4>${f.n}<span>Fase ${fi+1}</span></h4>${f.p.map((p,pi)=>{const id=r.id+"-"+fi+"-"+pi;return `<label class="step" for="${id}"><input type="checkbox" id="${id}" data-reto="${r.id}" data-k="${fi}-${pi}" ${st[fi+"-"+pi]?"checked":""}><span>${esc(p)}</span></label>`}).join("")}</div>`).join("")}</div>
   <div class="reto-meta">
    <div><b>Producto</b>${esc(r.producto)}</div><div><b>Tiempo</b>${esc(r.tiempo)}</div><div><b>Roles rotativos</b>${esc(r.roles)}</div>
   </div>
   <div><span class="eyebrow">Criterios de logro</span><ul class="crit">${r.crit.map(c=>`<li>${esc(c)}</li>`).join("")}</ul></div>
  </article>`}).join("");
}
document.addEventListener("change",ev=>{const c=ev.target.closest("[data-reto]");if(!c) return;
 const st=S.retos[c.dataset.reto]||(S.retos[c.dataset.reto]={});const was=!!st[c.dataset.k];st[c.dataset.k]=c.checked;
 if(c.checked&&!was) S.points+=5; if(!c.checked&&was) S.points=Math.max(0,S.points-5);
 save();checkBadges();renderRetos();});

/* ---------- CASOS ---------- */
let curCase="c1";
function renderCaseTabs(){$("#case-tabs").innerHTML=CASES.map(c=>{const n=Object.keys(S.cases[c.id]||{}).length;return `<button class="case-tab" data-case="${c.id}" aria-pressed="${c.id===curCase}"><span><b>${esc(c.t)}</b></span><small>${esc(c.short)} · ${n}/3 ${n===3?'<span class="tick">completo</span>':""}</small></button>`}).join("")}
function renderCase(){
 const c=CASES.find(x=>x.id===curCase),ans=S.cases[c.id]||{};
 $("#case").innerHTML=`<div class="case"><article class="source"><span class="kind">${esc(c.kind)}</span><h3>${esc(c.t)}</h3>${c.html}</article>
  <div class="qs">${c.qs.map((q,qi)=>{const e=evById[q.e],a=ans[qi];return `<div class="qcard lv-${e.a}"><div class="tag-row"><span class="chip">${q.e}</span><span class="status">${esc(e.short)}</span></div><p class="ask">${qi+1}. ${esc(q.q)}</p><div class="opts">${q.o.map((o,i)=>`<button class="opt ${a!==undefined&&i===q.c?"right":""} ${a===i&&i!==q.c?"wrong":""}" data-cq="${qi}" data-i="${i}" ${a!==undefined?"disabled":""}><b>${L[i]}</b><span>${esc(o)}</span></button>`).join("")}</div>${a!==undefined?`<div class="fb ${a===q.c?"ok":"no"}"><b>${a===q.c?"Correcto.":"Respuesta correcta: "+L[q.c]+"."}</b> ${esc(q.why)}</div>`:""}</div>`}).join("")}
   <div class="qcard"><label class="lbl" for="refl-${c.id}">Discusión en equipo</label><p class="status">${esc(c.disc)}</p><textarea id="refl-${c.id}" placeholder="Escriban aquí las conclusiones del equipo">${esc(S.refl[c.id]||"")}</textarea></div>
  </div></div>`;
 if(c.id==="c4"){const max=90;$("#info").innerHTML=INFO.map(([n,v,s])=>`<div class="info-row"><span>${esc(n)}</span><span class="track"><i class="${s?"saver":""}" style="width:${Math.max(1.5,v/max*100)}%"></i></span><span class="v">${String(v).replace(".",",")} L</span></div>`).join("")}
 const ta=$("#refl-"+c.id);ta.addEventListener("input",()=>{S.refl[c.id]=ta.value;save()});
 $("#case").querySelectorAll("[data-cq]").forEach(b=>b.onclick=()=>{const qi=+b.dataset.cq,i=+b.dataset.i,q=c.qs[qi];
  (S.cases[c.id]||(S.cases[c.id]={}))[qi]=i;award(evById[q.e].a,i===q.c);renderCaseTabs();renderCase();});
}
document.addEventListener("click",ev=>{const t=ev.target.closest("[data-case]");if(t){curCase=t.dataset.case;renderCaseTabs();renderCase()}});

/* ---------- INSIGNIAS ---------- */
function renderBadges(){
 const answered=Object.values(S.cases).reduce((n,c)=>n+Object.keys(c).length,0);
 $("#prog").innerHTML=`<div><b>${S.points}</b><span>puntos</span></div><div><b>${S.best}</b><span>mejor racha</span></div><div class="lv-A1"><b style="color:var(--lv)">${S.correct.A1}</b><span>aciertos literales</span></div><div class="lv-A2"><b style="color:var(--lv)">${S.correct.A2}</b><span>aciertos inferenciales</span></div><div class="lv-A3"><b style="color:var(--lv)">${S.correct.A3}</b><span>aciertos críticos</span></div><div><b>${answered}/12</b><span>preguntas de casos</span></div>`;
 $("#badges").innerHTML=BADGES.map(b=>{const on=S.badges.includes(b.id);return `<div class="badge ${on?"on":""} ${b.a?"lv-"+b.a:""}"><div class="medal" aria-hidden="true">${b.m}</div><div><h3>${esc(b.n)}</h3><p>${esc(b.d)}</p><span class="st">${on?"Ganada":"Pendiente"}</span></div></div>`}).join("");
}
$("#reset").onclick=()=>{$("#reset-confirm").hidden=false};
$("#reset-no").onclick=()=>{$("#reset-confirm").hidden=true};
$("#reset-yes").onclick=()=>{S=fresh();save();hud();renderBadges();renderRetos();renderCaseTabs();renderCase();$("#reset-confirm").hidden=true;toast("Progreso reiniciado")};

/* ---------- RUTAS ---------- */
const VIEWS=["matriz","emparejar","ruleta","retos","casos","insignias"];
function route(){
 const defaults={"/lectura-unidad.html":"matriz","/lectura-actividades.html":"emparejar",
  "/lectura-retos.html":"retos","/lectura-recursos.html":"casos","/lectura-progreso.html":"insignias"};
 const def=defaults[location.pathname]||"matriz";
 const hash=location.hash.slice(1);
 const v=location.pathname==="/lectura-actividades.html"&&["emparejar","ruleta"].includes(hash)?hash:def;
 document.querySelectorAll("[data-view]").forEach(s=>s.hidden=s.id!=="v-"+v);
 document.querySelectorAll("nav.tabs a").forEach(a=>{
  const u=new URL(a.href,location.href);
  const active=u.pathname===location.pathname && (v==="emparejar"||v==="ruleta"?u.hash==="#"+v:true);
  if(active)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");
 });
 if(v==="insignias")renderBadges(); if(v==="ruleta")drawWheel();}
addEventListener("hashchange",()=>{route();scrollTo(0,0)});
matchMedia("(prefers-color-scheme: dark)").addEventListener("change",drawWheel);
new MutationObserver(drawWheel).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
if(document.fonts) document.fonts.ready.then(drawWheel);

renderMatrix();newRound();renderRetos();renderCaseTabs();renderCase();hud();drawWheel();route();
