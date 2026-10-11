// Static files are served before this Worker runs, so it only sees requests
// that match no file. The root has no page of its own: it sends the reader to
// the guide in the first language their browser prefers that the guide has.
const LANGUAGES = ['en', 'cs'];
const FALLBACK = 'en';
// Slovak readers understand Czech better than English.
const CLOSEST = { sk: 'cs' };

export function preferredLanguage(acceptLanguage) {
  const ranked = (acceptLanguage || '')
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().toLowerCase().split(';');
      const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      const language = tag.split('-')[0];
      return { language: CLOSEST[language] ?? language, weight: q ? Number(q.slice(2)) : 1, index };
    })
    .filter(({ language, weight }) => LANGUAGES.includes(language) && weight > 0)
    .sort((a, b) => b.weight - a.weight || a.index - b.index);
  return ranked[0]?.language ?? FALLBACK;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/') return env.ASSETS.fetch(request);
    const target = new URL(`/${preferredLanguage(request.headers.get('Accept-Language'))}/`, url);
    return new Response(null, {
      status: 302,
      headers: { Location: target.href, Vary: 'Accept-Language' },
    });
  },
};
