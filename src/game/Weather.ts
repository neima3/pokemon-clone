export type WeatherType = 'clear' | 'rain' | 'sunny' | 'fog' | 'sandstorm' | 'hail';

export interface WeatherState {
  type: WeatherType;
  intensity: number;
  particles: WeatherParticle[];
  timer: number;
}

interface WeatherParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

const WEATHER_TRANSITIONS: Record<string, { weather: WeatherType; weight: number }[]> = {
  town: [{ weather: 'clear', weight: 60 }, { weather: 'sunny', weight: 30 }, { weather: 'rain', weight: 10 }],
  route1: [{ weather: 'clear', weight: 50 }, { weather: 'sunny', weight: 35 }, { weather: 'rain', weight: 15 }],
  route2: [{ weather: 'clear', weight: 45 }, { weather: 'rain', weight: 30 }, { weather: 'fog', weight: 25 }],
  route3: [{ weather: 'clear', weight: 55 }, { weather: 'sunny', weight: 25 }, { weather: 'rain', weight: 20 }],
  route4: [{ weather: 'clear', weight: 40 }, { weather: 'sandstorm', weight: 35 }, { weather: 'sunny', weight: 25 }],
  route5: [{ weather: 'clear', weight: 50 }, { weather: 'sunny', weight: 35 }, { weather: 'rain', weight: 15 }],
  route6: [{ weather: 'fog', weight: 45 }, { weather: 'rain', weight: 30 }, { weather: 'hail', weight: 25 }],
  route7: [{ weather: 'sandstorm', weight: 50 }, { weather: 'clear', weight: 30 }, { weather: 'fog', weight: 20 }],
  route8: [{ weather: 'sunny', weight: 45 }, { weather: 'clear', weight: 30 }, { weather: 'sandstorm', weight: 25 }],
};

export const WEATHER_EFFECTS: Record<WeatherType, { 
  name: string; 
  battleEffect?: string;
  moveBoost?: string;
  moveNerf?: string;
}> = {
  clear: { name: 'Clear' },
  sunny: { name: 'Harsh Sunlight', battleEffect: 'Fire moves boosted, Water moves weakened', moveBoost: 'fire', moveNerf: 'water' },
  rain: { name: 'Rain', battleEffect: 'Water moves boosted, Fire moves weakened', moveBoost: 'water', moveNerf: 'fire' },
  fog: { name: 'Fog', battleEffect: 'Accuracy reduced slightly' },
  sandstorm: { name: 'Sandstorm', battleEffect: 'Rock/Ground/Steel take no damage, others hurt' },
  hail: { name: 'Hail', battleEffect: 'Ice types protected, others hurt each turn' },
};

export class WeatherSystem {
  state: WeatherState;
  private viewW: number;
  private viewH: number;

  constructor(viewW: number, viewH: number) {
    this.viewW = viewW;
    this.viewH = viewH;
    this.state = {
      type: 'clear',
      intensity: 0,
      particles: [],
      timer: 0,
    };
  }

  setWeather(type: WeatherType, intensity: number = 1) {
    this.state.type = type;
    this.state.intensity = intensity;
    this.state.particles = [];
  }

  rollWeatherForZone(zone: string) {
    const transitions = WEATHER_TRANSITIONS[zone] ?? WEATHER_TRANSITIONS.town;
    const totalWeight = transitions.reduce((s, t) => s + t.weight, 0);
    let roll = Math.random() * totalWeight;
    for (const t of transitions) {
      roll -= t.weight;
      if (roll <= 0) {
        this.setWeather(t.weather);
        return t.weather;
      }
    }
    this.setWeather('clear');
    return 'clear';
  }

  update(dt: number) {
    this.state.timer += dt;

    const targetParticles = this.getTargetParticleCount();
    while (this.state.particles.length < targetParticles) {
      this.spawnParticle();
    }

    for (const p of this.state.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    }

    this.state.particles = this.state.particles.filter(p => p.life > 0 && p.y < this.viewH + 20 && p.x < this.viewW + 20);
  }

  private getTargetParticleCount(): number {
    const base = Math.floor(this.viewW * this.viewH / 2000);
    switch (this.state.type) {
      case 'rain': return base * 4;
      case 'hail': return base * 2;
      case 'sandstorm': return base * 3;
      case 'fog': return base * 1;
      case 'sunny': return base * 0.3;
      default: return 0;
    }
  }

  private spawnParticle() {
    switch (this.state.type) {
      case 'rain':
        this.state.particles.push({
          x: Math.random() * this.viewW,
          y: -10,
          vx: -30,
          vy: 300 + Math.random() * 100,
          life: 2 + Math.random(),
          maxLife: 2 + Math.random(),
          size: 2 + Math.random() * 2,
        });
        break;
      case 'hail':
        this.state.particles.push({
          x: Math.random() * this.viewW,
          y: -10,
          vx: -20,
          vy: 150 + Math.random() * 50,
          life: 2.5 + Math.random(),
          maxLife: 2.5 + Math.random(),
          size: 3 + Math.random() * 3,
        });
        break;
      case 'sandstorm':
        this.state.particles.push({
          x: -10,
          y: Math.random() * this.viewH,
          vx: 200 + Math.random() * 100,
          vy: Math.sin(this.state.timer * 2) * 20,
          life: 1.5 + Math.random(),
          maxLife: 1.5 + Math.random(),
          size: 2 + Math.random() * 2,
        });
        break;
      case 'fog':
        this.state.particles.push({
          x: Math.random() * this.viewW,
          y: Math.random() * this.viewH,
          vx: 10 + Math.random() * 20,
          vy: Math.sin(this.state.timer + Math.random()) * 5,
          life: 4 + Math.random() * 2,
          maxLife: 4 + Math.random() * 2,
          size: 30 + Math.random() * 40,
        });
        break;
      case 'sunny':
        this.state.particles.push({
          x: Math.random() * this.viewW,
          y: Math.random() * this.viewH,
          vx: 0,
          vy: -10,
          life: 1 + Math.random(),
          maxLife: 1 + Math.random(),
          size: 3 + Math.random() * 4,
        });
        break;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    for (const p of this.state.particles) {
      const alpha = Math.min(1, p.life / p.maxLife) * this.state.intensity;
      
      switch (this.state.type) {
        case 'rain':
          ctx.strokeStyle = `rgba(150, 180, 220, ${alpha * 0.6})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 0.02, p.y + p.vy * 0.02);
          ctx.stroke();
          break;
          
        case 'hail':
          ctx.fillStyle = `rgba(200, 220, 255, ${alpha * 0.8})`;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
          break;
          
        case 'sandstorm':
          ctx.fillStyle = `rgba(210, 180, 140, ${alpha * 0.5})`;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
          break;
          
        case 'fog':
          ctx.fillStyle = `rgba(200, 200, 210, ${alpha * 0.15})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        case 'sunny':
          ctx.fillStyle = `rgba(255, 240, 180, ${alpha * 0.4})`;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
          break;
      }
    }

    if (this.state.type === 'sunny') {
      ctx.fillStyle = 'rgba(255, 240, 200, 0.08)';
      ctx.fillRect(0, 0, this.viewW, this.viewH);
    } else if (this.state.type === 'fog') {
      ctx.fillStyle = 'rgba(180, 180, 190, 0.15)';
      ctx.fillRect(0, 0, this.viewW, this.viewH);
    } else if (this.state.type === 'sandstorm') {
      ctx.fillStyle = 'rgba(210, 180, 140, 0.1)';
      ctx.fillRect(0, 0, this.viewW, this.viewH);
    }
    
    ctx.restore();
  }

  getBattleDamageMultiplier(moveType: string): number {
    const effect = WEATHER_EFFECTS[this.state.type];
    if (!effect) return 1;
    if (effect.moveBoost === moveType) return 1.5;
    if (effect.moveNerf === moveType) return 0.5;
    return 1;
  }

  doesWeatherDamage(types: string[]): boolean {
    if (this.state.type === 'sandstorm') {
      return !types.some(t => t === 'rock' || t === 'ground' || t === 'steel');
    }
    if (this.state.type === 'hail') {
      return !types.some(t => t === 'ice');
    }
    return false;
  }

  getWeatherDamage(mon: { maxHp: number }): number {
    if (!this.doesWeatherDamage([])) return 0;
    return Math.max(1, Math.floor(mon.maxHp / 16));
  }
}
