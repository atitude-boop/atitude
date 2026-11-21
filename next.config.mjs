/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // O arquivo do teleprompter é lido do disco pela rota /teleprompter e precisa ir junto na publicação.
  outputFileTracingIncludes: { '/teleprompter': ['./conteudo/teleprompter.html'] },
};
export default nextConfig;
