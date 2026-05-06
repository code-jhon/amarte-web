// Script de cliente — hidrata la sección de podcast desde Google Sheets.
// Las funciones de API viven en src/lib/google-sheets.js.
// El mock de respaldo vive en src/data/podcast.js.
//
// Para activar la conexión en vivo:
//   Agrega PUBLIC_GOOGLE_SHEETS_API_KEY=tu_api_key en el archivo .env del proyecto.
//   Si la variable no está definida, el componente mantiene el contenido estático del build.

import { fetchPodcast } from '../lib/google-sheets.js';
import { EPISODE_GROUPS, PODCAST_INFO } from '../data/podcast.js';

const AUDIENCE_TAG = {
  parent:  { cssClass: 'ep-tag-parent',  label: 'Padres' },
  teacher: { cssClass: 'ep-tag-teacher', label: 'Docentes' },
  teen:    { cssClass: 'ep-tag-teen',    label: 'Adolescentes' },
};

// ── RENDER FUNCTIONS ──

export function renderPodcastInfo(info) {
  const el = document.getElementById('podcastInfoContent');
  if (!el) return;
  el.innerHTML = `
    <div class="section-tag purple">${info.tagLabel}</div>
    <h2>${info.name}</h2>
    <p>${info.description}</p>
    <div class="podcast-highlight">
      <div class="hl-label">${info.highlight.label}</div>
      <div class="hl-name">${info.highlight.name}</div>
      <p>${info.highlight.description}</p>
    </div>
    <div class="podcast-format">
      <h4>Formato del episodio</h4>
      <ul>${info.format.map((step) => `<li>${step}</li>`).join('')}</ul>
    </div>
  `;
}

export function renderEpisodes(groups) {
  const el = document.getElementById('episodesList');
  if (!el) return;
  el.innerHTML = groups
    .map((group) => {
      const tag = AUDIENCE_TAG[group.audience] ?? { cssClass: '', label: group.audience };
      return `
        <div class="ep-group-label">${group.label}</div>
        ${group.episodes
          .map(
            (ep) => `
          <div class="ep-card">
            <span class="ep-num">${ep.num}</span>
            <span class="ep-title">${ep.title}</span>
            <span class="ep-tag ${tag.cssClass}">${tag.label}</span>
          </div>`
          )
          .join('')}
      `;
    })
    .join('');
}

export function renderPodcast(info, groups) {
  renderPodcastInfo(info);
  renderEpisodes(groups);
}

// ── API FETCH ──

export async function loadPodcast() {
  const apiKey = import.meta.env.PUBLIC_GOOGLE_SHEETS_API_KEY;
  if (!apiKey) {
    // Sin API key: no reemplaza el contenido renderizado en build time
    return null;
  }
  const groups = await fetchPodcast(apiKey);
  // Si la hoja está vacía, mantiene el mock del build
  return {
    info: PODCAST_INFO,
    groups: groups.length > 0 ? groups : EPISODE_GROUPS,
  };
}
