// Google Sheets API v4 — fetch + parse for Eventos and Podcast sheets.
//
// REQUISITOS:
//   1. El spreadsheet debe ser compartido como "Cualquiera con el enlace puede ver".
//   2. Crea una API Key en Google Cloud Console → APIs & Services → Credentials.
//      Habilita la "Google Sheets API" y restringe la key a tu dominio.
//   3. Agrega PUBLIC_GOOGLE_SHEETS_API_KEY=tu_key en el archivo .env del proyecto.
//
// ── HOJA "Eventos" ─────────────────────────────────────────────────────────────
//   A (0)  Marca temporal
//   B (1)  Mes              ej. "Mayo"
//   C (2)  Día              ej. "10"
//   D (3)  Hora             ej. "9:00 am"
//   E (4)  Tipo             ej. "taller" | "charla" | "podcast" | "docentes"
//   F (5)  Título
//   G (6)  Descripción
//   H (7)  Lugar            ej. "Cali, Colombia" | "Virtual (Zoom)"
//   I (8)  Audiencia        ej. "Niños 6-12 años"
//   J (9)  Duración         ej. "90 minutos"
//   K (10) Precio           ej. "$80.000" | "Gratuita"
//   L (11) ¿Es gratuita?   "Sí" | "No"
//   M (12) Texto del botón  ej. "Reservar cupo"
//
// ── HOJA "Podcast" ─────────────────────────────────────────────────────────────
//   A (0)  Etiqueta de audiencia  ej. "Para Padres"
//   B (1)  Clave de audiencia     ej. "parent" | "teacher" | "teen"
//   C (2)  Número de episodio     ej. "EP01"
//   D (3)  Título del episodio

const SPREADSHEET_ID = '1EiwaQvccYgCQd4SFOeBHxGO-a3Cc3Ps8doNUZF7e1GQ';
const API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

const SHEETS = {
  eventos: 'Eventos',
  podcast: 'Podcast',
};

// ── Column indices ─────────────────────────────────────────────────────────────

const EVENTOS_COL = {
  timestamp:   0,
  month:       1,
  day:         2,
  time:        3,
  type:        4,
  title:       5,
  description: 6,
  location:    7,
  audience:    8,
  duration:    9,
  price:      10,
  free:       11,
  btnLabel:   12,
};

const PODCAST_COL = {
  label:    0,
  audience: 1,
  num:      2,
  title:    3,
};

// ── Low-level fetch ────────────────────────────────────────────────────────────

/**
 * Returns all rows (including header) from a named sheet tab.
 * @param {string} apiKey
 * @param {'eventos'|'podcast'} source
 * @returns {Promise<string[][]>}
 */
async function fetchSheetRows(apiKey, source) {
  const sheetName = SHEETS[source];
  if (!sheetName) throw new Error(`Unknown source: "${source}". Use "eventos" or "podcast".`);
  const url = `${API_BASE}/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}?key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Sheets API ${res.status}: ${body || res.statusText}`);
  }
  const json = await res.json();
  return json.values ?? [];
}

// ── Parsers ───────────────────────────────────────────────────────────────────

function parseFree(cell) {
  const v = String(cell ?? '').toLowerCase().trim();
  return v === 'sí' || v === 'si' || v === 'true' || v === '1' || v === 'gratuita' || v === 'gratuito';
}

/**
 * Converts raw Eventos rows into activity objects.
 * Skips the header row and rows without a title.
 * @param {string[][]} rows
 * @returns {import('../data/actividades.js').Actividad[]}
 */
export function parseSheetToActividades(rows) {
  if (rows.length < 2) return [];
  return rows
    .slice(1)
    .map(row => ({
      month:       row[EVENTOS_COL.month]       ?? '',
      day:         String(row[EVENTOS_COL.day]  ?? '').padStart(2, '0'),
      time:        row[EVENTOS_COL.time]        ?? '',
      type:        String(row[EVENTOS_COL.type] ?? '').toLowerCase().trim(),
      title:       row[EVENTOS_COL.title]       ?? '',
      description: row[EVENTOS_COL.description] ?? '',
      location:    row[EVENTOS_COL.location]    ?? '',
      audience:    row[EVENTOS_COL.audience]    ?? '',
      duration:    row[EVENTOS_COL.duration]    ?? '',
      price:       row[EVENTOS_COL.price]       ?? '',
      free:        parseFree(row[EVENTOS_COL.free]),
      btnLabel:    row[EVENTOS_COL.btnLabel]    ?? 'Ver más',
    }))
    .filter(e => e.title.trim() !== '');
}

/**
 * Converts raw Podcast rows into audience-grouped episode objects.
 * Skips the header row and rows without an episode number.
 * @param {string[][]} rows
 * @returns {{ label: string, audience: string, episodes: { num: string, title: string }[] }[]}
 */
export function parseSheetToPodcast(rows) {
  if (rows.length < 2) return [];

  // Preserve insertion order of audience groups.
  const groupMap = new Map();

  for (const row of rows.slice(1)) {
    const num   = String(row[PODCAST_COL.num]   ?? '').trim();
    const title = String(row[PODCAST_COL.title]  ?? '').trim();
    if (!num) continue;

    const audience = String(row[PODCAST_COL.audience] ?? '').trim();
    const label    = String(row[PODCAST_COL.label]    ?? '').trim();

    if (!groupMap.has(audience)) {
      groupMap.set(audience, { label, audience, episodes: [] });
    }
    groupMap.get(audience).episodes.push({ num, title });
  }

  return Array.from(groupMap.values());
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Fetches and transforms Eventos from Google Sheets.
 * @param {string} apiKey
 * @returns {Promise<import('../data/actividades.js').Actividad[]>}
 */
export async function fetchActividades(apiKey) {
  const rows = await fetchSheetRows(apiKey, 'eventos');
  return parseSheetToActividades(rows);
}

/**
 * Fetches and transforms Podcast episode groups from Google Sheets.
 * @param {string} apiKey
 * @returns {Promise<{ label: string, audience: string, episodes: { num: string, title: string }[] }[]>}
 */
export async function fetchPodcast(apiKey) {
  const rows = await fetchSheetRows(apiKey, 'podcast');
  return parseSheetToPodcast(rows);
}
