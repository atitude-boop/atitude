import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'App do Aluno Atitude',
    short_name: 'Atitude',
    description: 'A sua jornada na Atitude Escola de Oratória e Negócios.',
    lang: 'pt-BR',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F0F12',
    theme_color: '#0F0F12',
    icons: [
      { src: '/icone-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icone-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icone-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
