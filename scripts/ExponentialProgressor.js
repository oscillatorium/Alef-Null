//большое спасибо Chmonya за код
//паровозик сильнее
const ExponentialProgressor = {
  pattern: [2, 4, 8, 16, 32, 64, 128, 256, 512],
  cooldownTicks: 120,

  indices: {},
  cooldowns: {},
  prevReload: {},

  init() {
    Events.on(EventType.ContentInitEvent, () => {
      this.turret = Vars.content.getByName(ContentType.block, "alef-null-exponential-progressor");
      if (!this.turret) return;
      this.bulletType = this.turret.ammoTypes.values().toSeq().first();
      if (!this.bulletType) return;
      this.registerTick();
    });
  },

  applyBulletStats(stepIndex) {
    if (!this.bulletType) return;
    this.bulletType.damage = this.pattern[stepIndex];

    const t = stepIndex / (this.pattern.length - 1);
    const r1 = Math.floor(119 + (255 - 119) * t);
    const b1 = Math.floor(119 + (255 - 119) * t);
    const r2 = Math.floor(68 + (255 - 68) * t);
    const b2 = Math.floor(68 + (255 - 68) * t);

    const color1 = new Packages.arc.graphics.Color(r1 / 255.0, 1.0, b1 / 255.0, 1.0);
    const color2 = new Packages.arc.graphics.Color(r2 / 255.0, 1.0, b2 / 255.0, 1.0);
    const colors = this.bulletType.colors;
    if (colors && colors.length >= 2 && color1 && color2) {
      Packages.java.lang.reflect.Array.set(colors, 0, color1);
      Packages.java.lang.reflect.Array.set(colors, 1, color2);
    }
  },

  registerTick() {
    Events.run(Trigger.update, () => {
      if (!Vars.state.isGame() || Vars.state.isPaused() || !this.turret || !this.bulletType) return;

      Groups.build.each(building => {
        if (building.block !== this.turret) return;
        const id = building.id;

        if (!(id in this.indices)) {
          this.indices[id] = 0;
          this.cooldowns[id] = 0;
          this.prevReload[id] = building.reloadCounter;
          this.applyBulletStats(0);
          return;
        }

        if (this.cooldowns[id] > 0) {
          building.enabled = false;
          this.cooldowns[id]--;
          if (this.cooldowns[id] === 0) {
            this.applyBulletStats(0);
          }
          this.prevReload[id] = building.reloadCounter;
          return;
        }

        building.enabled = true;

        const prev = this.prevReload[id];
        const curr = building.reloadCounter;

        if (prev > 0 && curr <= 0) {
          const index = this.indices[id];
          this.applyBulletStats(index);

          const next = index + 1;
          if (next >= this.pattern.length) {
            this.indices[id] = 0;
            this.cooldowns[id] = this.cooldownTicks;
          } else {
            this.indices[id] = next;
            this.applyBulletStats(next);
          }
        }

        this.prevReload[id] = curr;
      });
    });
  }
};

module.exports = ExponentialProgressor;