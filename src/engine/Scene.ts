export interface Scene {
  update(dt: number): void;
  render(ctx: CanvasRenderingContext2D): void;
  onEnter?(): void;
  onExit?(): void;
}

export class SceneManager {
  private current: Scene | null = null;

  switch(scene: Scene) {
    this.current?.onExit?.();
    this.current = scene;
    this.current.onEnter?.();
  }

  update(dt: number) {
    this.current?.update(dt);
  }

  render(ctx: CanvasRenderingContext2D) {
    this.current?.render(ctx);
  }
}
