export class AssetLoader {
  private cache = new Map<string, HTMLImageElement>();

  load(key: string, src: string): Promise<HTMLImageElement> {
    const cached = this.cache.get(key);
    if (cached) return Promise.resolve(cached);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.cache.set(key, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  get(key: string): HTMLImageElement | undefined {
    return this.cache.get(key);
  }
}
