// ── PODCAST DATA ──
// Static variables ready to be replaced by API responses.
// To load from API swap the initialization block at the bottom for the fetch example.

const PODCAST_INFO = {
  tagLabel: 'Podcast',
  name: 'Rumbo a Marte',
  description: 'Episodios de 10 a 15 minutos con ciencia aplicada y herramientas reales. Tres audiencias, una misma dirección: el bienestar cerebral. 12 episodios de primera temporada.',
  highlight: {
    label: '⭐ Nombre recomendado',
    name: 'Rumbo a Marte',
    description: 'Directo, memorable y alineado con la metáfora central del proyecto. Evoca movimiento con propósito y conecta emocionalmente con todas las audiencias.'
  },
  format: [
    'Introducción al tema',
    'Explicación sencilla y clara',
    'Ejemplo cotidiano',
    'Herramientas prácticas',
    'Mensaje A_Marte — cierre reflexivo'
  ]
};

const EPISODE_GROUPS = [
  {
    label: 'Para Padres',
    audience: 'parent',
    episodes: [
      { num: 'EP01', title: '¿Las pantallas están cambiando el cerebro de mi hijo?' },
      { num: 'EP02', title: 'Déficit de atención: mito o realidad moderna' },
      { num: 'EP03', title: 'Niños impulsivos: lo que nadie explica' },
      { num: 'EP04', title: 'Autoestima infantil en la era digital' }
    ]
  },
  {
    label: 'Para Docentes',
    audience: 'teacher',
    episodes: [
      { num: 'EP05', title: 'El cerebro no aprende bajo presión' },
      { num: 'EP06', title: 'Estrategias reales para niños distraídos' },
      { num: 'EP07', title: 'Ajustes pedagógicos sin complicarse' },
      { num: 'EP08', title: 'Atención y movimiento en el aula' }
    ]
  },
  {
    label: 'Para Adolescentes',
    audience: 'teen',
    episodes: [
      { num: 'EP09', title: 'Redes sociales y comparación constante' },
      { num: 'EP10', title: 'Cómo entrenar tu atención' },
      { num: 'EP11', title: 'Tu cerebro no está dañado, está sobreestimulado' }
    ]
  }
];

// ── AUDIENCE TAG MAP ──
const AUDIENCE_TAG = {
  parent:  { cssClass: 'ep-tag-parent',  label: 'Padres' },
  teacher: { cssClass: 'ep-tag-teacher', label: 'Docentes' },
  teen:    { cssClass: 'ep-tag-teen',    label: 'Adolescentes' }
};

// ── RENDER FUNCTIONS ──

function renderPodcastInfo(data) {
  const el = document.getElementById('podcastInfoContent');
  if (!el) return;
  el.innerHTML = `
    <div class="section-tag purple">${data.tagLabel}</div>
    <h2>${data.name}</h2>
    <p>${data.description}</p>
    <div class="podcast-highlight">
      <div class="hl-label">${data.highlight.label}</div>
      <div class="hl-name">${data.highlight.name}</div>
      <p>${data.highlight.description}</p>
    </div>
    <div class="podcast-format">
      <h4>Formato del episodio</h4>
      <ul>${data.format.map(step => `<li>${step}</li>`).join('')}</ul>
    </div>
  `;
}

function renderEpisodes(groups) {
  const el = document.getElementById('episodesList');
  if (!el) return;
  el.innerHTML = groups.map(group => {
    const tag = AUDIENCE_TAG[group.audience];
    return `
      <div class="ep-group-label">${group.label}</div>
      ${group.episodes.map(ep => `
        <div class="ep-card">
          <span class="ep-num">${ep.num}</span>
          <span class="ep-title">${ep.title}</span>
          <span class="ep-tag ${tag.cssClass}">${tag.label}</span>
        </div>
      `).join('')}
    `;
  }).join('');
}

function renderPodcast(info, groups) {
  renderPodcastInfo(info);
  renderEpisodes(groups);
}

// ── INITIALIZATION ──
// Static data (default):
document.addEventListener('DOMContentLoaded', () => {
  renderPodcast(PODCAST_INFO, EPISODE_GROUPS);
});

// From API (swap the block above for this when ready):
// document.addEventListener('DOMContentLoaded', () => {
//   fetch('/api/podcast')
//     .then(r => r.json())
//     .then(data => renderPodcast(data.info, data.groups));
// });
