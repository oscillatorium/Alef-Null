// Расширенность для побочность генераторноость ноль
const generatorDecay = extend(ConsumeGenerator, "generator-decay", {
    update(tile) {
        this.super$update(tile);
        
        let entity = tile.ent();
        
        if (entity.warmup > 0.99 && entity.timer.get(0, 60)) {
            if (entity.items.get(itemMap.zero) < this.itemCapacity) {
                entity.items.add(itemMap.zero, 5);
            }
        }
    }
});
