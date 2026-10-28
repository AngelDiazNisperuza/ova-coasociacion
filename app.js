'use strict';

// Actividades públicas sin calificación automática; el guardado voluntario para usuarios registrados se gestiona desde progress.js.
const answers = {
  evidencia: { value: 'b', correct: 'Correcto. Un diagnóstico reúne observaciones, registros y voces de la comunidad antes de tomar decisiones.', incorrect: 'Revisa el papel de la evidencia: una solución debe responder a lo que se ha investigado, no a una suposición.' },
  calculo: { value: 'c', correct: 'Correcto. El ejemplo registra 2 + 5 + 3 = 10 litros por día; en siete días serían 70 litros. Son datos simulados.', incorrect: 'Suma las pérdidas diarias de los tres grifos y multiplica el resultado por siete.' }
};

for (const button of document.querySelectorAll('[data-check]')) {
  button.addEventListener('click', () => {
    const id = button.dataset.check;
    const group = document.querySelector(`[data-quiz="${id}"]`);
    const selected = group?.querySelector('input:checked');
    const feedback = document.querySelector(`[data-feedback="${id}"]`);
    if (!feedback) return;
    if (!selected) { feedback.textContent = 'Selecciona una opción para recibir retroalimentación.'; feedback.classList.remove('success'); return; }
    const isCorrect = selected.value === answers[id].value;
    feedback.textContent = isCorrect ? answers[id].correct : answers[id].incorrect;
    feedback.classList.toggle('success', isCorrect);
  });
}

const skills = ['Comunicación','Pensamiento crítico','Resolución de problemas','Colaboración'];
const rubric = document.querySelector('#rubric');
for (let i = 0; i < skills.length; i++) {
  const row = document.createElement('div');
  row.className = 'rubric-row';
  const label = document.createElement('label');
  label.htmlFor = `skill-${i}`;
  label.textContent = skills[i];
  const select = document.createElement('select');
  select.id = `skill-${i}`;
  select.name = `skill-${i}`;
  for (const [value,text] of [['','Seleccionar nivel'],['inicial','Inicial: necesito orientación'],['proceso','En proceso: puedo mejorar'],['logrado','Logrado en este reto: justifico mi actuación']]) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    select.append(option);
  }
  row.append(label, select);
  rubric?.append(row);
}

// Imprimir la ficha requiere que las respuestas aparezcan como texto en algunos navegadores.
document.querySelector('#print-summary')?.addEventListener('click', () => {
  window.print();
});

document.querySelector('#reset')?.addEventListener('click', () => {
  if (!window.confirm('¿Reiniciar las respuestas y reflexiones de esta actividad?')) return;
  document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
  document.querySelectorAll('textarea').forEach(area => area.value = '');
  document.querySelectorAll('select').forEach(select => select.value = '');
  document.querySelectorAll('.feedback').forEach(element => {element.textContent = ''; element.classList.remove('success');});
  document.querySelector('#reto')?.scrollIntoView({behavior: 'smooth'});
});

// Ruleta pública de aprendizaje colaborativo, sin seguimiento ni calificaciones.
const publicMissions = [
  'Comunicación: explica a otra persona la situación del agua con una evidencia concreta.',
  'Pensamiento crítico: identifica qué dato sería necesario verificar antes de actuar.',
  'Colaboración: escucha una propuesta de tu equipo y explica cómo podrías mejorarla.',
  'Resolución de problemas: compara dos soluciones y elige la que tenga mejores evidencias.',
  'Creatividad: crea un lema corto para promover el uso responsable del agua.',
  'Coasociación: acuerda una acción con otra persona y justifiquen la decisión compartida.'
];
let publicRotation=0,publicSpinning=false;
document.querySelector('#game-spin')?.addEventListener('click',()=>{
  if(publicSpinning)return;
  publicSpinning=true;
  const button=document.querySelector('#game-spin');
  const wheel=document.querySelector('.game-wheel');
  const result=document.querySelector('#game-result');
  const array=new Uint32Array(1);
  crypto.getRandomValues(array);
  const pick=array[0]%publicMissions.length;
  publicRotation+=720+Math.round(360*pick/publicMissions.length)+29;
  button.disabled=true;
  result.textContent='Seleccionando una misión…';
  wheel.style.transform='rotate('+publicRotation+'deg)';
  setTimeout(()=>{
    result.textContent=publicMissions[pick];
    button.disabled=false;
    publicSpinning=false;
  },window.matchMedia('(prefers-reduced-motion: reduce)').matches?10:1150);
});
