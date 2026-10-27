'use strict';

// Prototipo estático: no hay sesiones, analítica, almacenamiento ni solicitudes de red.
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