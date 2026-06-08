const ExponentialProgressor = {

  pattern: [2, 4, 8, 16, 32, 64, 128, 256, 512],
  cooldownTicks: 120,

  indices: {},
  cooldowns: {},
  lastShotTime: {},

  init() {
    Events.on(EventType.ContentInitEvent, () => {
      this.turret = Vars.content.getByName(ContentType.block, "alef-null-exponential-progressor");
      if (!this.turret) return;

      this.bulletType = this.turret.ammoTypes.values().toSeq().first();

      this.registerTick();
    });
  },

  registerTick() {
    Events.run(Trigger.update, () => {
      if (!Vars.state.isGame()) return;

      Groups.build.each(building => {
        if (building.block !== this.turret) return;

        const id = building.id;

        const justShot = building.reloadCounter <= 0 && (this.lastShotTime[id] || 1) > 0;
        this.lastShotTime[id] = building.reloadCounter;

        if (justShot) {
          if ((this.cooldowns[id] || 0) > 0) {
            this.cooldowns[id]--;
            this.bulletType.damage = 0;
            return;
          }

          const index = this.indices[id] || 0;
          this.bulletType.damage = this.pattern[index];

          const next = index + 1;
          if (next >= this.pattern.length) {
            this.indices[id] = 0;
            this.cooldowns[id] = this.cooldownTicks;
          } else {
            this.indices[id] = next;
          }
        }
      });
    });
  }

};

module.exports = ExponentialProgressor;