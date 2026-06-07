const DAMAGE_SEQUENCE = [2, 4, 8, 16, 32, 64, 128, 256, 512];
let shotIndex = 0;

let originalFindAmmo = null;

Events.on(ContentInitEvent, () => {
    let turret = Vars.content.getByName(ContentType.block, "exponential-progressor");
    if (!turret) {
        print("Турель не найдена");
        return;
    }
    
    // тям тятя тям тям тям
    originalFindAmmo = turret.findAmmo;
    
    // Переопределяем определение определения, которое определяет боеприпас
    turret.findAmmo = function(build) {
        let items = build.items;
        if (items.total() == 0) {
            this.ammoType = null;
            this.ammoItem = null;
            return;
        }
        
        let item = Vars.content.getByName(ContentType.item, "one");
        if (items.has(item)) {
            let bulletType = Vars.content.getByName(ContentType.bullet, "basic-bullet");
            let damage = DAMAGE_SEQUENCE[shotIndex % DAMAGE_SEQUENCE.length];
            
            // Создаём копию снаряда с нужным уровнем дибилизма
            this.ammoType = bulletType.copy();
            this.ammoType.damage = damage;
            this.ammoItem = item;
            shotIndex++;
            return;
        }
        
        this.ammoType = null;
        this.ammoItem = null;
    };
    
    print("Экспоненциальный прогрессор активирован");
});
