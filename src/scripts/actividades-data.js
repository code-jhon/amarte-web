// Script de cliente — hidrata la grilla de actividades desde Google Sheets.
// Las funciones de API viven en src/lib/google-sheets.js.
// El mock de respaldo vive en src/data/actividades.js.
//
// Para activar la conexión en vivo:
//   Agrega PUBLIC_GOOGLE_SHEETS_API_KEY=tu_api_key en el archivo .env del proyecto.
//   Si la variable no está definida, el componente mantiene el contenido estático del build.

import { fetchActividades } from '../lib/google-sheets.js';
import { ACTIVIDADES_MOCK } from '../data/actividades.js';

const EVENT_TYPE = {
  taller:   { badgeClass: 'badge-taller',   btnClass: 'btn-sm-mars',   monthColor: 'var(--mars-light)',   label: 'Taller' },
  charla:   { badgeClass: 'badge-charla',   btnClass: 'btn-sm-mint',   monthColor: 'var(--mint)',         label: 'Charla' },
  podcast:  { badgeClass: 'badge-podcast',  btnClass: 'btn-sm-blue',   monthColor: '#6B9EFF',             label: 'Podcast Live' },
  docentes: { badgeClass: 'badge-docentes', btnClass: 'btn-sm-nebula', monthColor: 'var(--nebula-light)', label: 'Taller Docentes' },
};

function buildEventCard(event, index) {
  const type = EVENT_TYPE[event.type] ?? EVENT_TYPE.taller;
  const delay = (Math.floor(index / 3) * 0.05) + (index % 3) * 0.1;
  const delayAttr = delay > 0 ? ` style="transition-delay:${delay}s"` : '';
  return `
    <div class="event-card reveal"${delayAttr}>
      <div class="event-header">
        <div class="event-date">
          <div class="event-month" style="color:${type.monthColor}">${event.month}</div>
          <div class="event-day">${event.day}</div>
        </div>
        <div class="event-sep"></div>
        <div class="event-time">${event.time}</div>
        <span class="event-type-badge ${type.badgeClass}">${type.label}</span>
      </div>
      <div class="event-body">
        <h3>${event.title}</h3>
        <p>${event.description}</p>
        <div class="event-meta">
          <span>📍 ${event.location}</span>
          <span>👥 ${event.audience}</span>
          <span>⏱ ${event.duration}</span>
        </div>
        <div class="event-footer">
          <span class="event-price${event.free ? ' free' : ''}">${event.price}</span>
          <button class="btn-sm ${type.btnClass}">${event.btnLabel}</button>
        </div>
      </div>
    </div>
  `;
}

export function renderActividades(events) {
  const grid = document.getElementById('actividadesGrid');
  if (!grid) return;
  grid.innerHTML = events.map((event, i) => buildEventCard(event, i)).join('');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  grid.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

export async function loadActividades() {
  const apiKey = import.meta.env.PUBLIC_GOOGLE_SHEETS_API_KEY;
  if (!apiKey) {
    // Sin API key: no reemplaza el contenido renderizado en build time
    return null;
  }
  const events = await fetchActividades(apiKey);
  // Si la hoja está vacía, mantiene el mock del build
  return events.length > 0 ? events : ACTIVIDADES_MOCK;
}
