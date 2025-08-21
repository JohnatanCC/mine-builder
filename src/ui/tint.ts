// NEW FILE: src/ui/tint.ts
// Aplica cor (tint) sobre PNG mantendo alpha e retorna DataURL (cacheado).
const cache = new Map<string, Promise<string>>();

export function tintImageURLToDataURL(url: string, tintCss: string): Promise<string> {
  const key = `${url}|${tintCss}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const p = new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const w = img.width || 32, h = img.height || 32;
      const cnv = document.createElement("canvas");
      cnv.width = w; cnv.height = h;
      const ctx = cnv.getContext("2d", { willReadFrequently: false })!;
      // base (grayscale do pack)
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      // multiply com a cor
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = tintCss;
      ctx.fillRect(0, 0, w, h);
      // recorta pela alpha original
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(img, 0, 0, w, h);
      resolve(cnv.toDataURL("image/png"));
    };
    img.onerror = (e) => reject(e);
    img.src = url;
  });

  cache.set(key, p);
  return p;
}
