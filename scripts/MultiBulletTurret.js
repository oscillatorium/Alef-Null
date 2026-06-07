const TURRET_NAME = "exponential-progressor";
const DAMAGE_SEQUENCE = [2, 4, 8, 16, 32, 64, 128, 256, 512];
let shotIndex = 0;

let turret = null;

Events.on(ContentInitEvent, () => {
    turret = Vars.content.getByName(ContentType.block, TURRET_NAME);
    if (!turret) {
        print("Turret not found: " + TURRET_NAME);
        return;
    }
    
    let originalBullet = turret.ammoTypes.get(Vars.content.getByName(ContentType.item, "one"));
    
    turret.ammoTypes.put(Vars.content.getByName(ContentType.item, "one"), {
        type: "BasicBulletType",
        damage: 1,
        speed: 6,
        lifetime: 34,
        hitEffect: Fx.hitLancer,
        shootEffect: Fx.shootBig,
        frontColor: Color.valueOf("77ff77")
    });
});

Events.on(Trigger.shoot, (unit, shoot, x, y, aimX, aimY) => {
    if (!turret) return;
    if (unit.type != turret) return;
    
    let damage = DAMAGE_SEQUENCE[shotIndex % DAMAGE_SEQUENCE.length];
    let bullet = unit.ammo;
    
    bullet.damage = damage;
    
    shotIndex++;
});
