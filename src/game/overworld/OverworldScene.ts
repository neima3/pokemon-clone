import type { Scene } from '@/engine/Scene';
import { Input } from '@/engine/Input';
import { SFX, Music } from '@/engine/Audio';
import { Player } from './Player';
import { Camera } from './Camera';
import { MAP_DATA, MAP_WIDTH, MAP_HEIGHT, MAP_NPCS, getRouteZone } from './mapData';
import { Tile, drawTile, isSolid, COLORS, updateTileAnim } from './tiles';
import { GameState, Inventory } from '../GameState';
import { NPC } from './NPC';
import { rollEncounter, ITEMS, SPECIES, TYPE_COLORS } from '../battle/data';
import { drawPokemonFront } from '../battle/sprites';

/** Native GB resolution: 160x144. We use 320x240 (20x15 tiles) for more room. */
export const VIEW_W = 320;
export const VIEW_H = 240;

const BASE_ENCOUNTER_RATE = 0.15; // ~1/6 steps in grass
const ENCOUNTER_RATES: Partial<Record<Tile, number>> = {
  [Tile.TallGrass]: BASE_ENCOUNTER_RATE,       // Standard grass rate
  // Water encounters would be lower rate when surfing
  // Cave areas would be higher rate
};
const FONT = 'bold 9px monospace';
const FONT_SM = 'bold 8px monospace';

type OverworldPhase = 'explore' | 'dialogue' | 'shop' | 'heal' | 'menu';

export class OverworldScene implements Scene {
  private input: Input;
  private player: Player;
  private camera: Camera;
  private onEncounter?: (speciesKey: string, level: number) => void;
  private onTrainerBattle?: (trainerId: string, npcId: string) => void;
  private gameState: GameState;
  private frozen = false;

  // NPCs
  private npcs: NPC[] = [];

  // Dialogue state
  private phase: OverworldPhase = 'explore';
  private dialogueTexts: string[] = [];
  private dialogueIndex = 0;
  private dialogueCharIdx = 0;
  private dialogueCallback: (() => void) | null = null;

  // Shop state
  private shopCursor = 0;
  private shopItems: Array<{ key: keyof Inventory; name: string; price: number }> = [
    { key: 'pokeball', name: 'POKé BALL', price: 200 },
    { key: 'greatBall', name: 'GREAT BALL', price: 600 },
    { key: 'ultraBall', name: 'ULTRA BALL', price: 1200 },
    { key: 'potion', name: 'POTION', price: 300 },
    { key: 'superPotion', name: 'SUPER POTION', price: 700 },
    { key: 'hyperPotion', name: 'HYPER POTION', price: 1200 },
    { key: 'maxPotion', name: 'MAX POTION', price: 2500 },
    { key: 'antidote', name: 'ANTIDOTE', price: 100 },
    { key: 'fullHeal', name: 'FULL HEAL', price: 600 },
    { key: 'revive', name: 'REVIVE', price: 1500 },
    { key: 'repel', name: 'REPEL', price: 350 },
  ];

  // Heal animation
  private healTimer = 0;

  // Zone music tracking
  private lastZone: string = '';

  // Menu state
  private menuCursor = 0;
  private menuSubPhase: 'main' | 'pokemon' | 'bag' | 'pokedex' | 'save' | 'pc' = 'main';
  private menuPokemonCursor = 0;

  // PC state
  private pcCursor = 0;
  private pcMode: 'select' | 'withdraw' | 'deposit' = 'select';

  // Bag cursor
  private bagCursor = 0;

  // Running shoes
  private isRunning = false;

  // HUD
  private showMiniStatus = true;

  constructor(
    input: Input,
    onEncounter: (speciesKey: string, level: number) => void,
    gameState: GameState,
    onTrainerBattle?: (trainerId: string, npcId: string) => void,
  ) {
    this.input = input;
    this.onEncounter = onEncounter;
    this.onTrainerBattle = onTrainerBattle;
    this.gameState = gameState;

    const startX = gameState.playerPosition.x;
    const startY = gameState.playerPosition.y;
    this.player = new Player(startX, startY);
    this.camera = new Camera(VIEW_W, VIEW_H, MAP_WIDTH, MAP_HEIGHT);

    // Create NPCs
    this.npcs = MAP_NPCS.map((data) => new NPC(data));
  }

  onEnter() {
    this.input.clear();
    this.frozen = false;
    this.phase = 'explore';

    if (this.gameState) {
      this.player.setPosition(this.gameState.playerPosition.x, this.gameState.playerPosition.y);
    }

    // Refresh NPC defeated states
    for (const npc of this.npcs) {
      if (npc.data.trainerId && this.gameState.isTrainerDefeated(npc.data.trainerId)) {
        npc.defeated = true;
      }
    }

    const zone = getRouteZone(this.player.gx, this.player.gy);
    this.lastZone = zone;
    this.playZoneMusic(zone);
  }

  private playZoneMusic(zone: string) {
    if (zone === 'pokemonLeague') {
      Music.pokemonLeague();
    } else if (zone === 'route4') {
      Music.route4();
    } else if (zone === 'route5') {
      Music.route5();
    } else if (zone === 'route6') {
      Music.route6();
    } else if (zone === 'route7') {
      Music.route7();
    } else if (zone === 'route8') {
      Music.route8();
    } else if (zone === 'route9') {
      Music.route9();
    } else {
      Music.overworld();
    }
  }

  onExit() {
    if (this.gameState) {
      this.gameState.playerPosition = { x: this.player.gx, y: this.player.gy };
    }
  }

  update(dt: number) {
    updateTileAnim(dt);

    switch (this.phase) {
      case 'explore':
        this.updateExplore(dt);
        break;
      case 'dialogue':
        this.updateDialogue(dt);
        break;
      case 'shop':
        this.updateShop();
        break;
      case 'heal':
        this.updateHeal(dt);
        break;
      case 'menu':
        this.updateMenu();
        break;
    }
  }

  private updateExplore(dt: number) {
    if (this.frozen) return;

    const wasMoving = this.player.isMoving;

    if (!this.player.isMoving) {
      // Check for menu open (M key or Start)
      if (this.input.getMenuPressed()) {
        SFX.menuConfirm();
        this.phase = 'menu';
        this.menuCursor = 0;
        this.menuSubPhase = 'main';
        return;
      }

      // Check for interaction
      if (this.input.getActionPressed()) {
        if (this.tryInteract()) return;
      }
      this.player.setRunning(this.isRunning || this.input.isRunning());

      // Toggle running shoes with B key
      if (this.input.getRunTogglePressed()) {
        this.isRunning = !this.isRunning;
        SFX.runToggle();
      }

      const dir = this.input.getDirection();
      if (dir) {
        this.player.tryMove(dir, (gx, gy) => {
          if (gx < 0 || gy < 0 || gx >= MAP_WIDTH || gy >= MAP_HEIGHT) return false;
          const tile = MAP_DATA[gy * MAP_WIDTH + gx];
          if (isSolid(tile)) return false;
          // Check NPC collision
          if (this.npcs.some((n) => n.gx === gx && n.gy === gy)) return false;
          return true;
        });
      }
    }
    this.player.update(dt);

    // Check for encounter when player finishes a step
    if (wasMoving && !this.player.isMoving) {
      // Switch music when crossing zone boundaries
      const zone = getRouteZone(this.player.gx, this.player.gy);
      if (zone !== this.lastZone) {
        this.lastZone = zone;
        this.playZoneMusic(zone);
      }
      this.checkPoisonDamage();
      this.checkEncounter();
    }

    this.camera.follow(this.player.px, this.player.py);
  }

  private tryInteract(): boolean {
    // Get tile in front of player
    let fx = this.player.gx;
    let fy = this.player.gy;
    switch (this.player.facing) {
      case 'up': fy--; break;
      case 'down': fy++; break;
      case 'left': fx--; break;
      case 'right': fx++; break;
    }

    // Check for NPC
    const npc = this.npcs.find((n) => n.gx === fx && n.gy === fy);
    if (npc) {
      SFX.menuConfirm();
      npc.faceToward(this.player.gx, this.player.gy);

      // Special NPC behaviors
      if (npc.id === 'nurse') {
        this.startDialogue(npc.data.dialogue.slice(0, 2), () => {
          this.phase = 'heal';
          this.healTimer = 0;
        });
        return true;
      }

      if (npc.id === 'shopkeeper') {
        this.startDialogue(npc.data.dialogue, () => {
          this.phase = 'shop';
          this.shopCursor = 0;
        });
        return true;
      }

      if (npc.id === 'pc_npc') {
        this.startDialogue(npc.data.dialogue, () => {
          this.phase = 'menu';
          this.menuSubPhase = 'pc';
          this.pcCursor = 0;
          this.pcMode = 'select';
        });
        return true;
      }

      // Exp Share researcher gives EXP. SHARE
      if (npc.id === 'exp_share_npc') {
        if (this.gameState.inventory.expShare > 0) {
          this.startDialogue(['How is the EXP. SHARE working?', 'Your whole team should be getting stronger!']);
        } else {
          this.startDialogue(npc.data.dialogue, () => {
            this.gameState.inventory.expShare = 1;
            this.gameState.save();
            this.startDialogue(['You received the EXP. SHARE!', 'All team POKéMON now get 50% EXP!']);
          });
        }
        return true;
      }

      // Fisherman gives OLD ROD
      if (npc.id === 'fisherman') {
        if (this.gameState.hasOldRod) {
          this.startDialogue(['Caught anything good yet?', 'Face water and press Z to fish!']);
        } else {
          this.startDialogue(npc.data.dialogue, () => {
            this.gameState.hasOldRod = true;
            this.gameState.save();
            this.startDialogue(['You received the OLD ROD!', 'Face water and press Z to fish!']);
          });
        }
        return true;
      }

      // Trainer NPC
      if (npc.data.isTrainer && npc.data.trainerId && !npc.defeated) {
        this.startDialogue(npc.data.dialogue, () => {
          this.frozen = true;
          this.gameState.playerPosition = { x: this.player.gx, y: this.player.gy };
          Music.stop();
          this.onTrainerBattle?.(npc.data.trainerId!, npc.id);
        });
        return true;
      }

      // Regular NPC or defeated trainer
      const dialogue = npc.defeated
        ? [npc.data.dialogue[npc.data.dialogue.length - 1]]
        : npc.data.dialogue;
      this.startDialogue(dialogue);
      return true;
    }

    // Check for sign
    if (fx >= 0 && fy >= 0 && fx < MAP_WIDTH && fy < MAP_HEIGHT) {
      const tile = MAP_DATA[fy * MAP_WIDTH + fx];
      if (tile === Tile.Sign) {
        SFX.menuSelect();
        // Context-sensitive sign text
        const zone = getRouteZone(fx, fy);
        if (zone === 'town') {
          this.startDialogue(['PALLET TOWN', 'A quiet place to start your journey.']);
        } else if (zone === 'route1') {
          this.startDialogue(['ROUTE 1', 'Wild POKéMON ahead! Be prepared!']);
        } else if (zone === 'route3') {
          this.startDialogue(['ROUTE 3', 'The path to CERULEAN GYM.']);
        } else if (zone === 'route4') {
          this.startDialogue(['ROUTE 4', 'Electric currents fill the air!']);
        } else if (zone === 'route5') {
          this.startDialogue(['ROUTE 5', 'A path through fiery meadows.']);
        } else if (zone === 'route6') {
          this.startDialogue(['ROUTE 6', 'An eerie mist hangs in the air...']);
        } else if (zone === 'route7') {
          this.startDialogue(['ROUTE 7', 'Toxic fumes fill the swamp...']);
        } else if (zone === 'route8') {
          this.startDialogue(['ROUTE 8', 'The volcanic heat is intense!']);
        } else if (zone === 'route9') {
          this.startDialogue(['ROUTE 9', 'VIRIDIAN CITY ahead.', 'The final GYM LEADER awaits!']);
        } else {
          this.startDialogue(['ROUTE 2', 'Stronger POKéMON live here.']);
        }
        return true;
      }

      // Check for building doors
      if (tile === Tile.PokeCenterDoor) {
        SFX.menuConfirm();
        this.startDialogue(['Welcome to the POKéMON CENTER!', 'We\'ll heal your POKéMON to full health!'], () => {
          this.phase = 'heal';
          this.healTimer = 0;
        });
        return true;
      }
      if (tile === Tile.MartDoor) {
        SFX.menuConfirm();
        this.startDialogue(['Welcome to the POKé MART!'], () => {
          this.phase = 'shop';
          this.shopCursor = 0;
        });
        return true;
      }
      if (tile === Tile.GymDoor) {
        SFX.menuConfirm();
        // Determine which gym based on position
        if (fy >= 56) {
          // Giovanni's Gym (Route 9 / Viridian City area)
          if (this.gameState.hasBadge('EARTH BADGE')) {
            this.startDialogue(['VIRIDIAN GYM', 'LEADER: GIOVANNI', 'You already have the EARTH BADGE!']);
          } else {
            this.startDialogue(['VIRIDIAN GYM', 'LEADER: GIOVANNI', 'Specializes in Ground-type POKéMON.']);
          }
        } else if (fy >= 48) {
          // Blaine's Gym (Route 8 area)
          if (this.gameState.hasBadge('VOLCANO BADGE')) {
            this.startDialogue(['CINNABAR GYM', 'LEADER: BLAINE', 'You already have the VOLCANO BADGE!']);
          } else {
            this.startDialogue(['CINNABAR GYM', 'LEADER: BLAINE', 'Specializes in Fire-type POKéMON.']);
          }
        } else if (fy >= 42) {
          // Koga's Gym (Route 7 area)
          if (this.gameState.hasBadge('SOUL BADGE')) {
            this.startDialogue(['FUCHSIA GYM', 'LEADER: KOGA', 'You already have the SOUL BADGE!']);
          } else {
            this.startDialogue(['FUCHSIA GYM', 'LEADER: KOGA', 'Specializes in Poison-type POKéMON.']);
          }
        } else if (fy >= 36) {
          // Erika's Gym (Route 5 area)
          if (this.gameState.hasBadge('RAINBOW BADGE')) {
            this.startDialogue(['CELADON GYM', 'LEADER: ERIKA', 'You already have the RAINBOW BADGE!']);
          } else {
            this.startDialogue(['CELADON GYM', 'LEADER: ERIKA', 'Specializes in Grass-type POKéMON.']);
          }
        } else if (fx >= 38) {
          // Lt. Surge's or Sabrina's Gym
          if (fy >= 30) {
            // Sabrina's Gym
            if (this.gameState.hasBadge('MARSH BADGE')) {
              this.startDialogue(['SAFFRON GYM', 'LEADER: SABRINA', 'You already have the MARSH BADGE!']);
            } else {
              this.startDialogue(['SAFFRON GYM', 'LEADER: SABRINA', 'Specializes in Psychic-type POKéMON.']);
            }
          } else {
            // Lt. Surge's Gym
            if (this.gameState.hasBadge('THUNDER BADGE')) {
              this.startDialogue(['VERMILION GYM', 'LEADER: LT. SURGE', 'You already have the THUNDER BADGE!']);
            } else {
              this.startDialogue(['VERMILION GYM', 'LEADER: LT. SURGE', 'Specializes in Electric-type POKéMON.']);
            }
          }
        } else if (fy >= 20) {
          if (this.gameState.hasBadge('CASCADE BADGE')) {
            this.startDialogue(['CERULEAN GYM', 'LEADER: MISTY', 'You already have the CASCADE BADGE!']);
          } else {
            this.startDialogue(['CERULEAN GYM', 'LEADER: MISTY', 'Specializes in Water-type POKéMON.']);
          }
        } else {
          if (this.gameState.hasBadge('BOULDER BADGE')) {
            this.startDialogue(['PEWTER GYM', 'LEADER: BROCK', 'You already have the BOULDER BADGE!']);
          } else {
            this.startDialogue(['PEWTER GYM', 'LEADER: BROCK', 'Specializes in Rock-type POKéMON.']);
          }
        }
        return true;
      }

      // Fishing: interact with water while holding OLD ROD
      if (tile === Tile.Water && this.gameState.hasOldRod) {
        SFX.menuConfirm();
        this.startDialogue(['...', '...', 'Oh! A bite!'], () => {
          this.frozen = true;
          this.gameState.playerPosition = { x: this.player.gx, y: this.player.gy };
          Music.stop();
          SFX.encounter();
          const encounter = rollEncounter('fishing');
          setTimeout(() => {
            this.onEncounter?.(encounter.species, encounter.level);
          }, 400);
        });
        return true;
      }
    }

    return false;
  }

  private startDialogue(texts: string[], callback?: () => void) {
    this.phase = 'dialogue';
    this.dialogueTexts = texts;
    this.dialogueIndex = 0;
    this.dialogueCharIdx = 0;
    this.dialogueCallback = callback ?? null;
  }

  private updateDialogue(dt: number) {
    this.dialogueCharIdx += dt * 40;

    if (this.input.getActionPressed()) {
      const currentText = this.dialogueTexts[this.dialogueIndex];
      if (this.dialogueCharIdx < currentText.length) {
        this.dialogueCharIdx = currentText.length;
      } else if (this.dialogueIndex < this.dialogueTexts.length - 1) {
        this.dialogueIndex++;
        this.dialogueCharIdx = 0;
      } else {
        if (this.dialogueCallback) {
          const cb = this.dialogueCallback;
          this.dialogueCallback = null;
          cb();
        } else {
          this.phase = 'explore';
        }
      }
    }
  }

  private updateShop() {
    const dir = this.input.getDirectionPressed();
    const totalItems = this.shopItems.length + 1; // +1 for EXIT

    if (dir === 'up' && this.shopCursor > 0) this.shopCursor--;
    if (dir === 'down' && this.shopCursor < totalItems - 1) this.shopCursor++;

    if (this.input.getCancelPressed()) {
      SFX.menuCancel();
      this.phase = 'explore';
      return;
    }

    if (this.input.getActionPressed()) {
      if (this.shopCursor >= this.shopItems.length) {
        SFX.menuCancel();
        this.phase = 'explore';
        return;
      }

      const item = this.shopItems[this.shopCursor];
      if (this.gameState.spendMoney(item.price)) {
        this.gameState.inventory[item.key]++;
        SFX.purchase();
        this.gameState.save();
      } else {
        SFX.bump();
      }
    }
  }

  private updateHeal(dt: number) {
    this.healTimer += dt;
    if (this.healTimer >= 1.5) {
      this.gameState.healTeam();
      this.gameState.save();
      SFX.heal();
      this.startDialogue(['Your POKéMON are fully healed!', 'Come back anytime!']);
    }
  }

  // ── Pause Menu ──

  private updateMenu() {
    switch (this.menuSubPhase) {
      case 'main': this.updateMenuMain(); break;
      case 'pokemon': this.updateMenuPokemon(); break;
      case 'bag': this.updateMenuBag(); break;
      case 'pokedex': this.updateMenuPokedex(); break;
      case 'save': this.updateMenuSave(); break;
      case 'pc': this.updateMenuPC(); break;
    }
  }

  private updateMenuMain() {
    const dir = this.input.getDirectionPressed();
    const items = 5; // POKéMON, BAG, POKéDEX, SAVE, CLOSE
    if (dir === 'up' && this.menuCursor > 0) { this.menuCursor--; SFX.menuSelect(); }
    if (dir === 'down' && this.menuCursor < items - 1) { this.menuCursor++; SFX.menuSelect(); }

    if (this.input.getCancelPressed() || this.input.getMenuPressed()) {
      SFX.menuCancel();
      this.phase = 'explore';
      return;
    }

    if (this.input.getActionPressed()) {
      SFX.menuConfirm();
      switch (this.menuCursor) {
        case 0: this.menuSubPhase = 'pokemon'; this.menuPokemonCursor = 0; break;
        case 1: this.menuSubPhase = 'bag'; this.bagCursor = 0; break;
        case 2: this.menuSubPhase = 'pokedex'; break;
        case 3: this.menuSubPhase = 'save'; break;
        case 4: this.phase = 'explore'; break;
      }
    }
  }

  private updateMenuPokemon() {
    const dir = this.input.getDirectionPressed();
    const total = this.gameState.team.length;
    if (dir === 'up' && this.menuPokemonCursor > 0) { this.menuPokemonCursor--; SFX.menuSelect(); }
    if (dir === 'down' && this.menuPokemonCursor < total - 1) { this.menuPokemonCursor++; SFX.menuSelect(); }

    if (this.input.getCancelPressed()) {
      SFX.menuCancel();
      this.menuSubPhase = 'main';
    }
  }

  private updateMenuBag() {
    const items = this.getBagItems();
    const totalItems = items.length + 1; // +1 for BACK

    const dir = this.input.getDirectionPressed();
    if (dir === 'up' && this.bagCursor > 0) { this.bagCursor--; SFX.menuSelect(); }
    if (dir === 'down' && this.bagCursor < totalItems - 1) { this.bagCursor++; SFX.menuSelect(); }

    if (this.input.getCancelPressed()) {
      SFX.menuCancel();
      this.menuSubPhase = 'main';
      this.bagCursor = 0;
      return;
    }

    if (this.input.getActionPressed()) {
      if (this.bagCursor >= items.length) {
        SFX.menuCancel();
        this.menuSubPhase = 'main';
        this.bagCursor = 0;
        return;
      }

      const item = items[this.bagCursor];
      if (item.key === 'repel') {
        if (this.gameState.useItem('repel')) {
          this.gameState.useRepel();
          SFX.menuConfirm();
          this.phase = 'explore';
          this.startDialogue(['Used REPEL!', 'Wild POKéMON will be repelled for a while!']);
        }
      } else if (item.key === 'potion' || item.key === 'superPotion' || item.key === 'hyperPotion' || item.key === 'maxPotion') {
        // Use healing item on lead Pokemon
        const lead = this.gameState.leadPokemon;
        if (lead && lead.hp < lead.maxHp) {
          if (this.gameState.useItem(item.key)) {
            const healAmount = item.key === 'potion' ? 20 : item.key === 'superPotion' ? 50 : item.key === 'hyperPotion' ? 200 : 9999;
            const before = lead.hp;
            lead.hp = Math.min(lead.maxHp, lead.hp + healAmount);
            const healed = lead.hp - before;
            SFX.heal();
            this.phase = 'explore';
            this.startDialogue([`Used ${item.name}!`, `${lead.name} recovered ${healed} HP!`]);
          }
        } else {
          SFX.bump();
        }
      } else if (item.key === 'antidote' || item.key === 'fullHeal') {
        const lead = this.gameState.leadPokemon;
        if (lead && lead.status) {
          if (item.key === 'antidote' && lead.status !== 'poison') {
            SFX.bump();
          } else if (this.gameState.useItem(item.key)) {
            lead.status = null;
            lead.sleepTurns = 0;
            SFX.heal();
            this.phase = 'explore';
            this.startDialogue([`Used ${item.name}!`, `${lead.name} was cured!`]);
          }
        } else {
          SFX.bump();
        }
      } else if (item.key === 'revive') {
        // Revive: find first fainted Pokemon in team
        const fainted = this.gameState.team.find(p => !p.isAlive);
        if (fainted) {
          if (this.gameState.useItem('revive')) {
            fainted.hp = Math.floor(fainted.maxHp / 2);
            SFX.heal();
            this.phase = 'explore';
            this.startDialogue([`Used REVIVE!`, `${fainted.name} was revived!`]);
          }
        } else {
          SFX.bump();
        }
      } else {
        SFX.bump();
      }
    }
  }

  private getBagItems(): Array<{ key: keyof Inventory; name: string; count: number }> {
    const all: Array<{ key: keyof Inventory; name: string; count: number }> = [
      { key: 'pokeball', name: 'POKé BALL', count: this.gameState.inventory.pokeball },
      { key: 'greatBall', name: 'GREAT BALL', count: this.gameState.inventory.greatBall },
      { key: 'ultraBall', name: 'ULTRA BALL', count: this.gameState.inventory.ultraBall },
      { key: 'potion', name: 'POTION', count: this.gameState.inventory.potion },
      { key: 'superPotion', name: 'SUPER POTION', count: this.gameState.inventory.superPotion },
      { key: 'hyperPotion', name: 'HYPER POTION', count: this.gameState.inventory.hyperPotion },
      { key: 'maxPotion', name: 'MAX POTION', count: this.gameState.inventory.maxPotion },
      { key: 'antidote', name: 'ANTIDOTE', count: this.gameState.inventory.antidote },
      { key: 'fullHeal', name: 'FULL HEAL', count: this.gameState.inventory.fullHeal },
      { key: 'revive', name: 'REVIVE', count: this.gameState.inventory.revive },
      { key: 'repel', name: 'REPEL', count: this.gameState.inventory.repel },
    ];
    return all.filter(i => i.count > 0);
  }

  private updateMenuPokedex() {
    if (this.input.getCancelPressed() || this.input.getActionPressed()) {
      SFX.menuCancel();
      this.menuSubPhase = 'main';
    }
  }

  private updateMenuSave() {
    this.gameState.playerPosition = { x: this.player.gx, y: this.player.gy };
    this.gameState.save();
    SFX.save();
    this.menuSubPhase = 'main';
  }

  private updateMenuPC() {
    const dir = this.input.getDirectionPressed();

    if (this.pcMode === 'select') {
      // Select between WITHDRAW, DEPOSIT, EXIT
      if (dir === 'up' && this.pcCursor > 0) { this.pcCursor--; SFX.menuSelect(); }
      if (dir === 'down' && this.pcCursor < 2) { this.pcCursor++; SFX.menuSelect(); }
      if (this.input.getCancelPressed()) { SFX.menuCancel(); this.phase = 'explore'; return; }
      if (this.input.getActionPressed()) {
        SFX.menuConfirm();
        if (this.pcCursor === 0) { this.pcMode = 'withdraw'; this.pcCursor = 0; }
        else if (this.pcCursor === 1) { this.pcMode = 'deposit'; this.pcCursor = 0; }
        else { this.phase = 'explore'; }
      }
    } else if (this.pcMode === 'withdraw') {
      const total = this.gameState.pcBox.length + 1; // +1 for BACK
      if (dir === 'up' && this.pcCursor > 0) { this.pcCursor--; SFX.menuSelect(); }
      if (dir === 'down' && this.pcCursor < total - 1) { this.pcCursor++; SFX.menuSelect(); }
      if (this.input.getCancelPressed()) { SFX.menuCancel(); this.pcMode = 'select'; this.pcCursor = 0; return; }
      if (this.input.getActionPressed()) {
        if (this.pcCursor >= this.gameState.pcBox.length) { SFX.menuCancel(); this.pcMode = 'select'; this.pcCursor = 0; return; }
        if (this.gameState.withdrawFromPC(this.pcCursor)) {
          SFX.menuConfirm();
          this.gameState.save();
        } else {
          SFX.bump();
        }
      }
    } else if (this.pcMode === 'deposit') {
      const total = this.gameState.team.length + 1;
      if (dir === 'up' && this.pcCursor > 0) { this.pcCursor--; SFX.menuSelect(); }
      if (dir === 'down' && this.pcCursor < total - 1) { this.pcCursor++; SFX.menuSelect(); }
      if (this.input.getCancelPressed()) { SFX.menuCancel(); this.pcMode = 'select'; this.pcCursor = 0; return; }
      if (this.input.getActionPressed()) {
        if (this.pcCursor >= this.gameState.team.length) { SFX.menuCancel(); this.pcMode = 'select'; this.pcCursor = 0; return; }
        if (this.gameState.depositToPC(this.pcCursor)) {
          SFX.menuConfirm();
          this.gameState.save();
          if (this.pcCursor >= this.gameState.team.length) this.pcCursor = Math.max(0, this.gameState.team.length - 1);
        } else {
          SFX.bump();
        }
      }
    }
  }

  private poisonStepCounter = 0;

  private checkPoisonDamage() {
    const lead = this.gameState.leadPokemon;
    if (!lead || lead.status !== 'poison' || !lead.isAlive) return;

    this.poisonStepCounter++;
    if (this.poisonStepCounter >= 4) {
      this.poisonStepCounter = 0;
      lead.hp = Math.max(1, lead.hp - 1);
      // Flash screen briefly to indicate poison damage
      if (lead.hp <= 1) {
        this.startDialogue([`${lead.name} is about to faint from poison!`]);
      }
    }
  }

  private checkEncounter() {
    const tile = MAP_DATA[this.player.gy * MAP_WIDTH + this.player.gx];
    const encounterRate = ENCOUNTER_RATES[tile as Tile] ?? 0;
    
    if (encounterRate > 0) {
      // Check repel
      if (this.gameState.repelSteps > 0) {
        const wasActive = this.gameState.tickRepel();
        if (!wasActive) {
          // Repel just wore off
          this.startDialogue(['REPEL wore off!']);
        }
        return;
      }
      if (Math.random() >= encounterRate) return;

      this.frozen = true;
      if (this.gameState) {
        this.gameState.playerPosition = { x: this.player.gx, y: this.player.gy };
      }
      Music.stop();
      SFX.encounter();
      const zone = getRouteZone(this.player.gx, this.player.gy);
      const encounter = rollEncounter(zone);
      // Small delay for the encounter SFX to play
      setTimeout(() => {
        this.onEncounter?.(encounter.species, encounter.level);
      }, 400);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    // Menu is full overlay
    if (this.phase === 'menu') {
      this.renderMenu(ctx);
      return;
    }

    ctx.fillStyle = COLORS.dark;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    const cx = this.camera.x;
    const cy = this.camera.y;

    const startCol = Math.max(0, Math.floor(cx / 16));
    const startRow = Math.max(0, Math.floor(cy / 16));
    const endCol = Math.min(MAP_WIDTH - 1, Math.floor((cx + VIEW_W) / 16));
    const endRow = Math.min(MAP_HEIGHT - 1, Math.floor((cy + VIEW_H) / 16));

    // Draw tiles
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const tile = MAP_DATA[row * MAP_WIDTH + col] as Tile;
        const px = col * 16 - cx;
        const py = row * 16 - cy;
        drawTile(ctx, tile, px, py);
      }
    }

    // Draw NPCs
    ctx.save();
    ctx.translate(-cx, -cy);
    for (const npc of this.npcs) {
      // Only draw if in view
      const npx = npc.gx * 16;
      const npy = npc.gy * 16;
      if (npx + 16 >= cx && npx < cx + VIEW_W && npy + 16 >= cy && npy < cy + VIEW_H) {
        npc.draw(ctx);
        // Draw exclamation mark over undefeated trainers
        if (npc.data.isTrainer && !npc.defeated) {
          ctx.fillStyle = '#f85830';
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('!', npx + 8, npy - 2);
          ctx.textAlign = 'left';
        }
      }
    }

    // Draw player
    this.player.draw(ctx);
    ctx.restore();

    // Day/night tint overlay
    this.drawDayNightOverlay(ctx);

    // Draw HUD
    this.drawHUD(ctx);

    // Draw dialogue box
    if (this.phase === 'dialogue') {
      this.drawDialogueBox(ctx);
    }

    // Draw shop menu
    if (this.phase === 'shop') {
      this.drawShopMenu(ctx);
    }

    // Draw heal animation
    if (this.phase === 'heal') {
      this.drawHealAnim(ctx);
    }
  }

  private drawDayNightOverlay(ctx: CanvasRenderingContext2D) {
    const hour = new Date().getHours();
    let tintColor = '';
    let alpha = 0;

    if (hour >= 20 || hour < 5) {
      // Night: dark blue overlay
      tintColor = '16, 24, 64';
      alpha = hour >= 22 || hour < 4 ? 0.35 : 0.2;
    } else if (hour >= 5 && hour < 7) {
      // Dawn: warm orange
      tintColor = '255, 160, 64';
      alpha = 0.12;
    } else if (hour >= 17 && hour < 20) {
      // Dusk: warm amber
      tintColor = '255, 128, 48';
      alpha = 0.08 + (hour - 17) * 0.04;
    }

    if (alpha > 0) {
      ctx.fillStyle = `rgba(${tintColor}, ${alpha})`;
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    }
  }

  private drawHUD(ctx: CanvasRenderingContext2D) {
    if (!this.showMiniStatus || this.phase !== 'explore') return;

    const lead = this.gameState.leadPokemon;
    if (!lead) return;

    // Zone indicator
    const zone = getRouteZone(this.player.gx, this.player.gy);
    const zoneNames: Record<string, string> = { town: 'PALLET TOWN', route1: 'ROUTE 1', route2: 'ROUTE 2', route3: 'ROUTE 3', route4: 'ROUTE 4', route5: 'ROUTE 5', route6: 'ROUTE 6', route7: 'ROUTE 7' };
    const zoneName = zoneNames[zone] ?? zone.toUpperCase();

    ctx.fillStyle = 'rgba(8, 24, 32, 0.7)';
    ctx.fillRect(2, 2, 100, 12);
    ctx.fillStyle = COLORS.bg;
    ctx.font = 'bold 7px monospace';
    ctx.textBaseline = 'top';
    ctx.fillText(zoneName, 6, 4);

    // Money + badges
    ctx.fillStyle = 'rgba(8, 24, 32, 0.7)';
    ctx.fillRect(VIEW_W - 72, 2, 70, 12);
    ctx.fillStyle = '#f8d870';
    ctx.fillText(`¥${this.gameState.money}`, VIEW_W - 68, 4);

    // Badge count
    if (this.gameState.badges.size > 0) {
      ctx.fillStyle = 'rgba(8, 24, 32, 0.7)';
      ctx.fillRect(VIEW_W - 72, 16, 70, 12);
      ctx.fillStyle = '#f8d830';
      ctx.fillText(`\u2605 ${this.gameState.badges.size} BADGE`, VIEW_W - 68, 18);
    }
  }

  private drawDialogueBox(ctx: CanvasRenderingContext2D) {
    const bx = 4, by = VIEW_H - 60, bw = VIEW_W - 8, bh = 56;

    ctx.fillStyle = '#f8f8f0';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    const text = this.dialogueTexts[this.dialogueIndex];
    const shown = text.substring(0, Math.floor(this.dialogueCharIdx));

    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT;
    ctx.textBaseline = 'top';

    // Word wrap
    const lines = wrapText(shown, 38);
    for (let i = 0; i < lines.length && i < 2; i++) {
      ctx.fillText(lines[i], bx + 10, by + 8 + i * 16);
    }

    // Blinking advance indicator
    if (this.dialogueCharIdx >= text.length && Math.floor(Date.now() / 400) % 2 === 0) {
      ctx.fillText('\u25bc', bx + bw - 18, by + bh - 16);
    }
  }

  private drawShopMenu(ctx: CanvasRenderingContext2D) {
    const bx = 40, by = 20, bw = VIEW_W - 80, bh = 160;

    // Background
    ctx.fillStyle = '#f8f8f0';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    // Title
    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillText('POKé MART', bx + bw / 2, by + 6);

    // Money display
    ctx.fillStyle = '#f8d870';
    ctx.font = FONT_SM;
    ctx.fillText(`Money: ¥${this.gameState.money}`, bx + bw / 2, by + 20);
    ctx.textAlign = 'left';

    // Items
    ctx.font = FONT;
    for (let i = 0; i < this.shopItems.length; i++) {
      const item = this.shopItems[i];
      const y = by + 38 + i * 22;

      if (i === this.shopCursor) {
        ctx.fillStyle = COLORS.dark;
        ctx.fillText('\u25b6', bx + 10, y);
      }

      ctx.fillStyle = COLORS.dark;
      ctx.fillText(item.name, bx + 26, y);

      // Price
      ctx.font = FONT_SM;
      ctx.textAlign = 'right';
      ctx.fillText(`¥${item.price}`, bx + bw - 12, y + 1);

      // Current stock
      const count = this.gameState.inventory[item.key];
      ctx.fillText(`x${count}`, bx + bw - 60, y + 1);
      ctx.textAlign = 'left';
      ctx.font = FONT;
    }

    // EXIT
    const exitY = by + 38 + this.shopItems.length * 22;
    if (this.shopCursor === this.shopItems.length) {
      ctx.fillStyle = COLORS.dark;
      ctx.fillText('\u25b6', bx + 10, exitY);
    }
    ctx.fillStyle = COLORS.dark;
    ctx.fillText('EXIT', bx + 26, exitY);

    // Instructions
    ctx.font = 'bold 7px monospace';
    ctx.fillStyle = COLORS.mid;
    ctx.textAlign = 'center';
    ctx.fillText('Z: Buy  X: Exit', bx + bw / 2, by + bh - 14);
    ctx.textAlign = 'left';
  }

  private drawHealAnim(ctx: CanvasRenderingContext2D) {
    // Pulsing overlay
    const alpha = 0.3 + Math.sin(this.healTimer * 8) * 0.2;
    ctx.fillStyle = `rgba(255, 160, 160, ${alpha})`;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    // Centered text
    ctx.fillStyle = '#f8f8f0';
    ctx.font = FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Healing your POKéMON...', VIEW_W / 2, VIEW_H / 2);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
  }

  // ── Menu Rendering ──

  private renderMenu(ctx: CanvasRenderingContext2D) {
    switch (this.menuSubPhase) {
      case 'main': this.renderMenuMain(ctx); break;
      case 'pokemon': this.renderMenuPokemon(ctx); break;
      case 'bag': this.renderMenuBag(ctx); break;
      case 'pokedex': this.renderMenuPokedex(ctx); break;
      case 'save': this.renderMenuMain(ctx); break; // Save is instant
      case 'pc': this.renderMenuPC(ctx); break;
    }
  }

  private renderMenuMain(ctx: CanvasRenderingContext2D) {
    // Full screen background
    ctx.fillStyle = '#283848';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    // Menu panel (right side)
    const mx = VIEW_W - 130, my = 10, mw = 120, mh = 140;
    ctx.fillStyle = '#f8f8f0';
    ctx.fillRect(mx, my, mw, mh);
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(mx, my, mw, mh);

    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT;
    ctx.textBaseline = 'top';

    const items = ['POKéMON', 'BAG', 'POKéDEX', 'SAVE', 'CLOSE'];
    for (let i = 0; i < items.length; i++) {
      const y = my + 10 + i * 24;
      if (i === this.menuCursor) {
        ctx.fillText('\u25b6', mx + 8, y);
      }
      ctx.fillText(items[i], mx + 24, y);
    }

    // Player info panel (left side)
    const px = 10, py = 10, pw = 160, ph = 100;
    ctx.fillStyle = '#f8f8f0';
    ctx.fillRect(px, py, pw, ph);
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(px, py, pw, ph);

    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT;
    ctx.fillText('TRAINER CARD', px + 10, py + 8);

    ctx.font = FONT_SM;
    ctx.fillText(`Money: ¥${this.gameState.money}`, px + 10, py + 28);
    ctx.fillText(`POKéDEX: ${this.gameState.pokedexCaught.size} caught`, px + 10, py + 42);
    ctx.fillText(`Badges: ${this.gameState.badges.size}`, px + 10, py + 56);

    // Draw badge stars
    let badgeX = px + 10;
    for (const badge of this.gameState.badges) {
      ctx.fillStyle = '#f8d830';
      ctx.fillRect(badgeX, py + 70, 12, 12);
      ctx.fillStyle = '#c0a020';
      ctx.fillRect(badgeX + 2, py + 72, 8, 8);
      ctx.fillStyle = '#f8d830';
      ctx.fillRect(badgeX + 4, py + 74, 4, 4);
      badgeX += 16;
    }

    // Controls hint
    ctx.fillStyle = '#88c070';
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Z: Select  X/M: Close', VIEW_W / 2, VIEW_H - 16);
    ctx.textAlign = 'left';
  }

  private renderMenuPokemon(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#283848';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    // Title
    ctx.fillStyle = '#f8f8f0';
    ctx.font = FONT;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillText('POKéMON', VIEW_W / 2, 6);
    ctx.textAlign = 'left';

    // Team list (left side)
    for (let i = 0; i < this.gameState.team.length; i++) {
      const mon = this.gameState.team[i];
      const y = 24 + i * 28;
      const selected = i === this.menuPokemonCursor;

      // Background
      ctx.fillStyle = selected ? '#485868' : '#384858';
      ctx.fillRect(4, y, 150, 26);
      ctx.strokeStyle = selected ? '#88c070' : '#506878';
      ctx.lineWidth = 1;
      ctx.strokeRect(4, y, 150, 26);

      // Cursor
      if (selected) {
        ctx.fillStyle = '#88c070';
        ctx.font = FONT;
        ctx.fillText('\u25b6', 8, y + 6);
      }

      // Name + Level
      ctx.fillStyle = mon.isAlive ? '#f8f8f0' : '#a08080';
      ctx.font = FONT;
      ctx.fillText(mon.name, 24, y + 4);
      ctx.font = FONT_SM;
      ctx.fillText(`Lv${mon.level}`, 24, y + 16);

      // HP bar
      const barX = 80, barW = 60, barH = 5;
      ctx.fillStyle = '#181818';
      ctx.fillRect(barX, y + 18, barW, barH);
      const pct = mon.hpPercent;
      const fillW = Math.max(0, (barW - 2) * pct);
      ctx.fillStyle = pct > 0.5 ? '#48b048' : pct > 0.2 ? '#f8c830' : '#e04040';
      ctx.fillRect(barX + 1, y + 19, fillW, barH - 2);

      // HP text
      ctx.fillStyle = '#f8f8f0';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${mon.hp}/${mon.maxHp}`, 152, y + 6);
      ctx.textAlign = 'left';
    }

    // Selected Pokemon details (right side)
    if (this.menuPokemonCursor < this.gameState.team.length) {
      const mon = this.gameState.team[this.menuPokemonCursor];
      const dx = 162, dy = 24, dw = 152, dh = 196;

      ctx.fillStyle = '#384858';
      ctx.fillRect(dx, dy, dw, dh);
      ctx.strokeStyle = '#506878';
      ctx.lineWidth = 1;
      ctx.strokeRect(dx, dy, dw, dh);

      // Draw sprite
      drawPokemonFront(ctx, mon.species.id, dx + 44, dy + 4);

      // Types
      ctx.font = FONT_SM;
      ctx.textAlign = 'center';
      for (let t = 0; t < mon.species.types.length; t++) {
        const type = mon.species.types[t];
        const color = (TYPE_COLORS as Record<string, string>)[type] ?? '#808080';
        ctx.fillStyle = color;
        ctx.fillRect(dx + 20 + t * 58, dy + 62, 52, 11);
        ctx.fillStyle = '#f8f8f0';
        ctx.font = 'bold 7px monospace';
        ctx.fillText(type.toUpperCase(), dx + 46 + t * 58, dy + 64);
      }
      ctx.textAlign = 'left';

      // Stats
      ctx.font = FONT_SM;
      ctx.fillStyle = '#88c070';
      const stats = [
        { label: 'HP', value: `${mon.hp}/${mon.maxHp}` },
        { label: 'ATK', value: `${mon.attack}` },
        { label: 'DEF', value: `${mon.defense}` },
        { label: 'SPD', value: `${mon.speed}` },
      ];
      for (let s = 0; s < stats.length; s++) {
        const sy = dy + 80 + s * 14;
        ctx.fillStyle = '#88a0b8';
        ctx.fillText(stats[s].label, dx + 10, sy);
        ctx.fillStyle = '#f8f8f0';
        ctx.textAlign = 'right';
        ctx.fillText(stats[s].value, dx + dw - 10, sy);
        ctx.textAlign = 'left';
      }

      // Moves
      ctx.fillStyle = '#88a0b8';
      ctx.fillText('MOVES:', dx + 10, dy + 140);
      ctx.fillStyle = '#f8f8f0';
      for (let m = 0; m < mon.moves.length; m++) {
        ctx.fillText(mon.moves[m].data.name, dx + 14, dy + 154 + m * 12);
      }

      // Status
      if (mon.status) {
        const statusLabels: Record<string, string> = {
          poison: 'POISONED', burn: 'BURNED', paralyze: 'PARALYZED', sleep: 'ASLEEP',
        };
        ctx.fillStyle = '#e04040';
        ctx.fillText(statusLabels[mon.status] ?? '', dx + 10, dy + dh - 14);
      }
    }

    // Controls
    ctx.fillStyle = '#88c070';
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('X: Back', VIEW_W / 2, VIEW_H - 8);
    ctx.textAlign = 'left';
  }

  private renderMenuBag(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#283848';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    const bx = 40, by = 30, bw = VIEW_W - 80, bh = 170;
    ctx.fillStyle = '#f8f8f0';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillText('BAG', bx + bw / 2, by + 8);
    ctx.textAlign = 'left';

    const items = this.getBagItems();

    for (let i = 0; i < items.length; i++) {
      const y = by + 28 + i * 18;
      if (i === this.bagCursor) {
        ctx.fillStyle = COLORS.dark;
        ctx.fillText('\u25b6', bx + 8, y);
      }
      ctx.fillStyle = COLORS.dark;
      ctx.font = FONT;
      ctx.fillText(items[i].name, bx + 22, y);
      ctx.font = FONT_SM;
      ctx.textAlign = 'right';
      ctx.fillText(`x${items[i].count}`, bx + bw - 14, y + 1);
      ctx.textAlign = 'left';
    }

    // BACK option
    const backY = by + 28 + items.length * 18;
    if (this.bagCursor === items.length) {
      ctx.fillStyle = COLORS.dark;
      ctx.font = FONT;
      ctx.fillText('\u25b6', bx + 8, backY);
    }
    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT;
    ctx.fillText('BACK', bx + 22, backY);

    ctx.fillStyle = '#88c070';
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Z: Use  X: Back', bx + bw / 2, by + bh - 14);
    ctx.textAlign = 'left';
  }

  private renderMenuPC(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#283848';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    const bx = 30, by = 16, bw = VIEW_W - 60, bh = 200;
    ctx.fillStyle = '#f8f8f0';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillText('POKéMON STORAGE SYSTEM', bx + bw / 2, by + 6);
    ctx.textAlign = 'left';

    if (this.pcMode === 'select') {
      const options = ['WITHDRAW', 'DEPOSIT', 'EXIT'];
      for (let i = 0; i < options.length; i++) {
        const y = by + 34 + i * 24;
        if (i === this.pcCursor) {
          ctx.fillStyle = COLORS.dark;
          ctx.fillText('\u25b6', bx + 20, y);
        }
        ctx.fillStyle = COLORS.dark;
        ctx.font = FONT;
        ctx.fillText(options[i], bx + 38, y);
      }

      // Show summary counts
      ctx.font = FONT_SM;
      ctx.fillStyle = COLORS.mid;
      ctx.fillText(`Team: ${this.gameState.team.length}/6`, bx + 20, by + 110);
      ctx.fillText(`PC Box: ${this.gameState.pcBox.length} stored`, bx + 20, by + 126);

    } else if (this.pcMode === 'withdraw') {
      ctx.fillStyle = COLORS.mid;
      ctx.font = FONT_SM;
      ctx.fillText(`WITHDRAW  (Team: ${this.gameState.team.length}/6)`, bx + 14, by + 24);

      if (this.gameState.pcBox.length === 0) {
        ctx.fillStyle = COLORS.dark;
        ctx.font = FONT;
        ctx.fillText('No POKéMON in PC.', bx + 40, by + 60);
      } else {
        for (let i = 0; i < this.gameState.pcBox.length; i++) {
          const mon = this.gameState.pcBox[i];
          const y = by + 38 + i * 20;
          if (y > by + bh - 30) break;
          if (i === this.pcCursor) {
            ctx.fillStyle = COLORS.dark;
            ctx.fillText('\u25b6', bx + 12, y);
          }
          ctx.fillStyle = COLORS.dark;
          ctx.font = FONT;
          ctx.fillText(mon.name, bx + 28, y);
          ctx.font = FONT_SM;
          ctx.textAlign = 'right';
          ctx.fillText(`Lv${mon.level}  HP:${mon.hp}/${mon.maxHp}`, bx + bw - 14, y + 1);
          ctx.textAlign = 'left';
        }
        // BACK option
        const backY = by + 38 + this.gameState.pcBox.length * 20;
        if (this.pcCursor === this.gameState.pcBox.length) {
          ctx.fillStyle = COLORS.dark;
          ctx.fillText('\u25b6', bx + 12, backY);
        }
        ctx.fillStyle = COLORS.dark;
        ctx.font = FONT;
        ctx.fillText('BACK', bx + 28, backY);
      }

    } else if (this.pcMode === 'deposit') {
      ctx.fillStyle = COLORS.mid;
      ctx.font = FONT_SM;
      ctx.fillText(`DEPOSIT  (PC: ${this.gameState.pcBox.length} stored)`, bx + 14, by + 24);

      for (let i = 0; i < this.gameState.team.length; i++) {
        const mon = this.gameState.team[i];
        const y = by + 38 + i * 20;
        if (i === this.pcCursor) {
          ctx.fillStyle = COLORS.dark;
          ctx.fillText('\u25b6', bx + 12, y);
        }
        ctx.fillStyle = COLORS.dark;
        ctx.font = FONT;
        ctx.fillText(mon.name, bx + 28, y);
        ctx.font = FONT_SM;
        ctx.textAlign = 'right';
        ctx.fillText(`Lv${mon.level}  HP:${mon.hp}/${mon.maxHp}`, bx + bw - 14, y + 1);
        ctx.textAlign = 'left';
      }
      // BACK option
      const backY = by + 38 + this.gameState.team.length * 20;
      if (this.pcCursor === this.gameState.team.length) {
        ctx.fillStyle = COLORS.dark;
        ctx.fillText('\u25b6', bx + 12, backY);
      }
      ctx.fillStyle = COLORS.dark;
      ctx.font = FONT;
      ctx.fillText('BACK', bx + 28, backY);
    }

    // Controls
    ctx.fillStyle = '#88c070';
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Z: Select  X: Back', bx + bw / 2, by + bh - 12);
    ctx.textAlign = 'left';
  }

  private renderMenuPokedex(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#283848';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    const bx = 20, by = 20, bw = VIEW_W - 40, bh = 190;
    ctx.fillStyle = '#e04040';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#a02020';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    // Inner screen
    ctx.fillStyle = '#f8f8f0';
    ctx.fillRect(bx + 8, by + 8, bw - 16, bh - 16);
    ctx.strokeStyle = COLORS.dark;
    ctx.strokeRect(bx + 8, by + 8, bw - 16, bh - 16);

    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillText('POKéDEX', bx + bw / 2, by + 14);
    ctx.textAlign = 'left';

    ctx.font = FONT_SM;
    ctx.fillText(`SEEN: ${this.gameState.pokedexSeen.size}`, bx + 20, by + 32);
    ctx.fillText(`CAUGHT: ${this.gameState.pokedexCaught.size}`, bx + 120, by + 32);

    // List seen Pokemon
    const allSpecies = Object.entries(SPECIES).sort((a, b) => a[1].id - b[1].id);
    let row = 0;
    for (const [key, species] of allSpecies) {
      if (!this.gameState.pokedexSeen.has(key)) continue;
      const x = bx + 20 + (row % 3) * 90;
      const y = by + 50 + Math.floor(row / 3) * 16;
      if (y > by + bh - 30) break;

      const caught = this.gameState.pokedexCaught.has(key);
      ctx.fillStyle = caught ? COLORS.dark : '#808080';
      ctx.font = 'bold 7px monospace';
      const icon = caught ? '\u25cf' : '\u25cb';
      ctx.fillText(`${icon} #${String(species.id).padStart(3, '0')} ${species.name}`, x, y);
      row++;
    }

    ctx.fillStyle = '#88c070';
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Press any key to go back', VIEW_W / 2, VIEW_H - 16);
    ctx.textAlign = 'left';
  }
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    if (line.length + word.length + 1 > maxChars && line.length > 0) {
      lines.push(line);
      line = word;
    } else {
      line = line ? line + ' ' + word : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}
