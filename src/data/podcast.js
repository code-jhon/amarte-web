// Build-time data — imported by Podcast.astro to render at SSG time.
// Keep in sync with src/scripts/podcast-data.js (the API-ready version).

export const PODCAST_INFO = {
  tagLabel: 'Podcast',
  name: 'Rumbo a Marte',
  description:
    'Episodios de 10 a 15 minutos con ciencia aplicada y herramientas reales. Tres audiencias, una misma dirección: el bienestar cerebral. 12 episodios de primera temporada.',
  highlight: {
    label: '⭐ Nombre recomendado',
    name: 'Rumbo a Marte',
    description:
      'Directo, memorable y alineado con la metáfora central del proyecto. Evoca movimiento con propósito y conecta emocionalmente con todas las audiencias.',
  },
  format: [
    'Introducción al tema',
    'Explicación sencilla y clara',
    'Ejemplo cotidiano',
    'Herramientas prácticas',
    'Mensaje A_Marte — cierre reflexivo',
  ],
};

export const EPISODE_GROUPS = [
  {
    label: 'Para Padres',
    audience: 'parent',
    episodes: [
      { num: 'EP01', title: '¿Las pantallas están cambiando el cerebro de mi hijo?' },
      { num: 'EP02', title: 'Déficit de atención: mito o realidad moderna' },
      { num: 'EP03', title: 'Niños impulsivos: lo que nadie explica' },
      { num: 'EP04', title: 'Autoestima infantil en la era digital' },
    ],
  },
  {
    label: 'Para Docentes',
    audience: 'teacher',
    episodes: [
      { num: 'EP05', title: 'El cerebro no aprende bajo presión' },
      { num: 'EP06', title: 'Estrategias reales para niños distraídos' },
      { num: 'EP07', title: 'Ajustes pedagógicos sin complicarse' },
      { num: 'EP08', title: 'Atención y movimiento en el aula' },
    ],
  },
  {
    label: 'Para Adolescentes',
    audience: 'teen',
    episodes: [
      { num: 'EP09', title: 'Redes sociales y comparación constante' },
      { num: 'EP10', title: 'Cómo entrenar tu atención' },
      { num: 'EP11', title: 'Tu cerebro no está dañado, está sobreestimulado' },
    ],
  },
];

export const AUDIENCE_TAG = {
  parent:  { cssClass: 'ep-tag-parent',  label: 'Padres' },
  teacher: { cssClass: 'ep-tag-teacher', label: 'Docentes' },
  teen:    { cssClass: 'ep-tag-teen',    label: 'Adolescentes' },
};
