const ExponentialProgressor = {
  pattern: [2, 4, 8, 16, 32, 64, 128, 256, 512],
  cooldownTicks: 120,
  indices: {},
  cooldowns: {},
  lastShotTime: {},
  bulletTypeCache: null,

  init() {
    Events.on(EventType.ContentInitEvent, () => {
      this.turret = Vars.content.getByName(ContentType.block, "alef-null-exponential-progressor");
      if (!this.turret) return;
      
      let ammoTypes = this.turret.ammoTypes;
      for (let entry of ammoTypes.entries()) {
        this.bulletTypeCache = entry.value;
        break;
      }
      if (!this.bulletTypeCache) return;

      Events.run(Trigger.update, () => {
        if (!Vars.state.isGame()) return;
        Groups.build.each(building => {
          if (building.block !== this.turret) return;
          const id = building.id;

          const justShot = building.reloadCounter <= 0 && (this.lastShotTime[id] ?? 1) > 0;
          this.lastShotTime[id] = building.reloadCounter;

          if (justShot) {
            if ((this.cooldowns[id] || 0) > 0) {
              this.cooldowns[id]--;
              let dummyBullet = this.createBulletCopy(0);
              building.ammoType = dummyBullet;
              return;
            }

            const index = this.indices[id] || 0;
            let newBullet = this.createBulletCopy(this.pattern[index]);
            building.ammoType = newBullet;

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
    });
  },

  createBulletCopy(damage) {
    let copy = this.bulletTypeCache.copy();
    copy.damage = damage;
    return copy;
  }
};

const GeneratorDecay = {
  ticksPerItem: 120,
  tickers: {},
  init() {
    Events.on(EventType.ContentInitEvent, () => {
      this.generator = Vars.content.getByName(ContentType.block, "alef-null-generator-decay");
      this.zeroItem = Vars.content.getByName(ContentType.item, "alef-null-zero");
      if (!this.generator || !this.zeroItem) return;

      Events.run(Trigger.update, () => {
        if (!Vars.state.isGame()) return;
        Groups.build.each(building => {
          if (building.block !== this.generator) return;
          const id = building.id;
          const count = building.items.get(this.zeroItem);
          const capacity = building.block.itemCapacity;
          const canDump = building.dump(this.zeroItem);

          if (count >= capacity && !canDump) {
            building.enabled = false;
            this.tickers[id] = 0;
            return;
          }
          building.enabled = true;
          if (building.efficiency <= 0) {
            this.tickers[id] = 0;
            return;
          }
          this.tickers[id] = (this.tickers[id] || 0) + 1;
          if (this.tickers[id] < this.ticksPerItem) return;
          this.tickers[id] = 0;
          building.offload(this.zeroItem);
        });
      });
    });
  }
};

Events.on(EventType.ContentInitEvent, () => {
  ExponentialProgressor.init();
  GeneratorDecay.init();
});