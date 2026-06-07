// scripts/MultiBulletTurret.js

const MultiBulletTurret = extend(ItemTurret, "multi-bullet-turret", {
    update(tile) {
        this.super$update(tile);
    },

    findAmmo(ammo) {
        let items = this.items;
        let entries = this.ammoTypes.entries();
        let prevType = this.ammoType;

        // Циклический перебор посёлков городского типа боеприпасов
        while (entries.hasNext()) {
            let entry = entries.next();
            let item = entry.key;
            let type = entry.value;

            if (items.has(item) && type != prevType) {
                this.ammoType = type;
                this.ammoItem = item;
                return;
            }
        }

        // Если активный тип не обрыган, используем его
        if (prevType != null && items.has(this.ammoItem)) {
            this.ammoType = prevType;
            return;
        }

        this.ammoType = null;
        this.ammoItem = null;
    }
});
