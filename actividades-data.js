// ── ACTIVIDADES DATA ──
// Mock data matching current static HTML.
// Replace loadActividades() with a real fetch when the API is ready.

// ── EVENT TYPE MAP ──
// Single source of truth for badge, button, and month-color per event type.
const EVENT_TYPE = {
  taller:   { badgeClass: 'badge-taller',   btnClass: 'btn-sm-mars',   monthColor: 'var(--mars-light)',   label: 'Taller' },
  charla:   { badgeClass: 'badge-charla',   btnClass: 'btn-sm-mint',   monthColor: 'var(--mint)',         label: 'Charla' },
  podcast:  { badgeClass: 'badge-podcast',  btnClass: 'btn-sm-blue',   monthColor: '#6B9EFF',             label: 'Podcast Live' },
  docentes: { badgeClass: 'badge-docentes', btnClass: 'btn-sm-nebula', monthColor: 'var(--nebula-light)', label: 'Taller Docentes' }
};

// ── MOCK DATA ──
const ACTIVIDADES_MOCK = [
  {
    month: 'Mayo',
    day: '10',
    time: '9:00 am',
    type: 'taller',
    title: 'Misión Marte — Sesión 1',
    description: 'Primera sesión del taller cognitivo para niños. Cupos limitados a 8 participantes por sesión.',
    location: 'Cali, Colombia',
    audience: 'Niños 6-12 años',
    duration: '90 minutos',
    price: '$80.000',
    free: false,
    btnLabel: 'Reservar cupo'
  },
  {
    month: 'Mayo',
    day: '17',
    time: '11:00 am',
    type: 'charla',
    title: 'Pantallas y cerebro infantil',
    description: 'Charla virtual para padres sobre el impacto de las pantallas y estrategias prácticas de acompañamiento digital.',
    location: 'Virtual (Zoom)',
    audience: 'Padres y cuidadores',
    duration: '60 minutos',
    price: 'Gratuita',
    free: true,
    btnLabel: 'Inscribirme'
  },
  {
    month: 'Mayo',
    day: '24',
    time: '9:00 am',
    type: 'taller',
    title: 'Misión Marte — Sesión 2',
    description: 'Segunda sesión del taller cognitivo. Profundizamos en regulación emocional y atención sostenida.',
    location: 'Cali, Colombia',
    audience: 'Niños 6-12 años',
    duration: '90 minutos',
    price: '$80.000',
    free: false,
    btnLabel: 'Reservar cupo'
  },
  {
    month: 'Junio',
    day: '07',
    time: '7:00 pm',
    type: 'podcast',
    title: 'Estreno Temporada 1 — Rumbo a Marte',
    description: 'Lanzamiento en vivo del podcast. Primeros tres episodios, preguntas en tiempo real y sorteos.',
    location: 'Virtual (Instagram Live)',
    audience: 'Toda la comunidad',
    duration: '45 minutos',
    price: 'Gratuito',
    free: true,
    btnLabel: 'Notificarme'
  },
  {
    month: 'Junio',
    day: '14',
    time: '9:00 am',
    type: 'taller',
    title: 'Misión Marte — Sesión 3',
    description: 'Tercera sesión del taller. Enfoque en funciones ejecutivas y memoria de trabajo con dinámicas nuevas.',
    location: 'Cali, Colombia',
    audience: 'Niños 6-12 años',
    duration: '90 minutos',
    price: '$80.000',
    free: false,
    btnLabel: 'Reservar cupo'
  },
  {
    month: 'Junio',
    day: '21',
    time: '10:00 am',
    type: 'docentes',
    title: 'Aula Neurocompatible',
    description: 'Taller virtual para docentes sobre estrategias pedagógicas basadas en neurociencia para el aula inclusiva.',
    location: 'Virtual (Zoom)',
    audience: 'Docentes',
    duration: '120 minutos',
    price: '$50.000',
    free: false,
    btnLabel: 'Reservar cupo'
  }
];

// ── RENDER ──

function buildEventCard(event, index) {
  const type = EVENT_TYPE[event.type];
  // Staggered reveal delay: rows of 3, first row 0/0.1/0.2s, second row 0.05/0.15/0.25s
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

function renderActividades(events) {
  const grid = document.getElementById('actividadesGrid');
  if (!grid) return;

  grid.innerHTML = events.map((event, i) => buildEventCard(event, i)).join('');

  // Re-observe new cards for scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── API FETCH ──

async function loadActividades() {
  // Swap the return below for the fetch block when the API is ready.
  return ACTIVIDADES_MOCK;

  // From API:
  // const response = await fetch('/api/actividades');
  // if (!response.ok) throw new Error(`API error: ${response.status}`);
  // return response.json(); // expects an array matching ACTIVIDADES_MOCK shape
}

// ── INIT ──

document.addEventListener('DOMContentLoaded', () => {
  loadActividades()
    .then(events => renderActividades(events))
    .catch(err => {
      console.error('Failed to load actividades, falling back to mock:', err);
      renderActividades(ACTIVIDADES_MOCK);
    });
});
