const GeneratorDecay = {

  ticksPerItem: 120,
  tickers: {},

  init() {
    Events.on(EventType.ContentInitEvent, () => {
      this.generator = Vars.content.getByName(ContentType.block, "alef-null-generator-decay");
      this.zeroItem  = Vars.content.getByName(ContentType.item, "alef-null-zero");
      this.registerTick();
    });
  },

  registerTick() {
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
  }

};

module.exports = GeneratorDecay;
