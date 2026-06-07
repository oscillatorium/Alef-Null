const TURRET_NAME = "exponential-progressor";
const DAMAGE_SEQUENCE = [2, 4, 8, 16, 32, 64, 128, 256, 512];
let shotIndex = 0;

let turret = null;
let oneItem = null;

Events.on(ContentInitEvent, () => {
    turret = Vars.content.getByName(ContentType.block, TURRET_NAME);
    oneItem = Vars.content.getByName(ContentType.item, "one");
    if (!turret || !oneItem) {
        print("Turret or item not found");
        return;
    }
});

Events.on(Trigger.shoot, (unit, shoot, x, y, aimX, aimY) => {
    if (!turret) return;
    if (unit.type != turret) return;
    
    let damage = DAMAGE_SEQUENCE[shotIndex % DAMAGE_SEQUENCE.length];
    
    let bulletType = turret.ammoTypes.get(oneItem);
    if (!bulletType) return;
    
    if (typeof bulletType.damage !== 'undefined') {
        bulletType.damage = damage;
    }
    
    shotIndex++;
});
