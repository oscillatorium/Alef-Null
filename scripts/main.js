const GeneratorDecay        = require("GeneratorDecay");
const ExponentialProgressor = require("ExponentialProgressor");

GeneratorDecay.init();
ExponentialProgressor.init();


const mathWarpFx = new Effect(30, e => {
    Draw.color(Pal.accent, Color.white, e.fin()); Lines.stroke(3 * e.fout());
    Lines.circle(e.x, e.y, e.fin() * 40); Lines.circle(e.x, e.y, e.fout() * 20);
    Lines.line(e.x - 15 * e.fout(), e.y, e.x + 15 * e.fout(), e.y);
    Lines.line(e.x, e.y - 15 * e.fout(), e.x, e.y + 15 * e.fout());
});
const mathShieldHitFx = new Effect(15, e => {
    Draw.color(Color.white, Pal.accent, e.fin()); Lines.stroke(1.5 * e.fout());
    Angles.randLenVectors(e.id, 5, 2 + e.fin() * 15, e.rotation, 45, (x, y) => { Lines.line(e.x, e.y, e.x + x, e.y + y); });
});
const mathSeriesFrag = extend(BasicBulletType, {
    damage: 80, speed: 4, lifetime: 30, width: 12, height: 12, sprite: "math-bullet-frag",
    backColor: Pal.accent, frontColor: Color.white, despawnEffect: Fx.none, hitEffect: Fx.hitBulletSmall
});
const mathSeriesBullet = extend(ArtilleryBulletType, {
    damage: 15, speed: 5, lifetime: 60, width: 18, height: 18, sprite: "math-bullet",
    backColor: Pal.accent, frontColor: Color.white, splashDamage: 2048, splashDamageRadius: 60,
    fragBullet: mathSeriesFrag, fragBullets: 32, fragVelocityMin: 0.6, fragVelocityMax: 1.4,
    hitEffect: Fx.shockwave, despawnEffect: Fx.shockwave
});




const mathClone = new UnitType("math-clone");

// Базовые параметры юнита
mathClone.health = 1500;
mathClone.speed = 2.5;
mathClone.hitSize = 14;
mathClone.flying = true;
mathClone.drawCell = false;
mathClone.engineSize = 0;

// Создание и настройка оружия
const w = new Weapon(); // В v6/v7 конструктор вызывается без пустой строки
w.rotate = false;
w.reload = 20;
w.x = 0;
w.y = 0;
w.mirror = false;

// Привязка пули (убедитесь, что mathSeriesFrag объявлена выше в коде)
w.bullet = mathSeriesFrag;

// Добавление оружия юниту
mathClone.weapons.add(w);

        


        


const ePiBoss = extend(UnitType, "math-boss", {
    init() {
        this.super$init();

        this.health = 20000;
        this.speed = 1.4;
        this.hitSize = 32;
        this.armor = 6;
        this.flying = true;
        this.drawCell = false;
        this.engineSize = 0;

        let sw = new Weapon(); 
        sw.x = 0;
        sw.y = 0;
        sw.mirror = false;
        sw.rotate = false;
        sw.reload = 25;
        sw.bullet = mathSeriesBullet;
        
        this.weapons.add(sw);
    }
});

ePiBoss.constructor = () => extend(UnitEntity, {
    init() {
        this.super$init();

        this.phase = 0;
        this.cloneCooldown = 0;
        this.warpCooldown = 0;
        this.warpDuration = 0;
        this.lastHealth = 20000;
        this.healed = false;
        this.shieldHealth = 0;
        this.maxShieldHealth = 15000;
        this.shieldAlpha = 0;
    },

    draw() {
        this.super$draw(); 

        if (this.phase === 5) {
            Draw.rect(Core.atlas.find("alef-null-math-boss"), this.x, this.y, 0);
            Draw.z(Layer.flyingUnit + 0.1); 
            Draw.rect(Core.atlas.find("boss-normal"), this.x, this.y + 24, 0);
            
            if (this.shieldHealth > 0) {
                if (this.shieldAlpha > 0.3) this.shieldAlpha -= 0.02;
                Draw.color(Pal.accent); 
                Draw.alpha(this.shieldAlpha);
                Draw.rect(Core.atlas.find("alef-null-boss-shield"), this.x, this.y, 72, 72, 0); 
                Draw.reset();
            }
        } else {
            let sN = "alef-null-boss-normal";
            if (this.phase === 4) sN = "alef-null-boss-warp"; 
            else if (this.phase === 3) sN = "boss-minus";
            else if (this.phase === 2) sN = "alef-null-boss-spawn"; 
            else if (this.phase === 1) sN = "boss-shoot";
            
            Draw.rect(Core.atlas.find(sN), this.x, this.y, 0);
        }
    },

    update() {
        this.super$update();

        if (this.cloneCooldown > 0) this.cloneCooldown--; 
        if (this.warpCooldown > 0) this.warpCooldown--;

        if (this.health <= this.maxHealth * 0.25 && this.phase !== 5) {
            if (!this.healed) {
                this.health = 40000; 
                this.shieldHealth = this.maxShieldHealth;
                this.shieldAlpha = 0.8; 
                this.healed = true; 
                Fx.shockwave.at(this.x, this.y);
            }
            this.phase = 5; 
            return;
        }

        if (this.phase === 5) {
            this.vel.limit(0.7); 
            let dT = this.lastHealth - this.health;
            if (dT > 0 && this.shieldHealth > 0) {
                this.shieldHealth -= dT; 
                this.health += dT; 
                this.shieldAlpha = 0.9;
                
                let targetX = Vars.player ? Vars.player.x : this.x;
                let targetY = Vars.player ? Vars.player.y : this.y;
                mathShieldHitFx.at(this.x, this.y, this.angleTo(targetX, targetY));
                
                if (this.shieldHealth <= 0) { 
                    this.shieldHealth = 0; 
                    Fx.shockwave.at(this.x, this.y); 
                }
            }
            this.lastHealth = this.health; 
            return;
        }

        if (this.phase === 4) {
            this.warpDuration--; 
            this.apply(StatusEffects.unmoving, 2); 
            this.apply(StatusEffects.disarmed, 2);
            if (this.warpDuration <= 0) this.phase = 0; 
            return;
        }

        let dT = this.lastHealth - this.health; 
        this.lastHealth = this.health;

        if ((dT > 400 || (this.target != null && this.dst(this.target.x, this.target.y) < 70)) && this.warpCooldown === 0) {
            this.phase = 4; 
            this.warpCooldown = 500; 
            this.warpDuration = 12;
            
            mathWarpFx.at(this.x, this.y); 
            Fx.lightningCharge.at(this.x, this.y);
            
            let wA = Mathf.random(360);
            let tX = this.x + Angles.trnsx(wA, 140); 
            let tY = this.y + Angles.trnsy(wA, 140);
            
            this.x = Mathf.clamp(tX, 0, Vars.world.width() * Vars.tilesize); 
            this.y = Mathf.clamp(tY, 0, Vars.world.height() * Vars.tilesize);
            
            mathWarpFx.at(this.x, this.y); 
            Fx.scatheExplosion.at(this.x, this.y); 
            return;
        }

        if (dT > 200) { 
            this.phase = 3; 
            this.apply(StatusEffects.fast, 20); 
            this.apply(StatusEffects.disarmed, 2); 
            return; 
        }

        if (this.health < this.maxHealth && this.cloneCooldown === 0 && Mathf.chance(0.03)) {
            this.phase = 2; 
            this.cloneCooldown = 450;
            for (let i = 0; i < 2; i++) {
                let a = Mathf.random(360); 
                let cx = this.x + Angles.trnsx(a, 50); 
                let cy = this.y + Angles.trnsy(a, 50);
                mathClone.spawn(this.team, cx, cy);
            }
            return;
        }

        if (this.target != null) { 
            this.phase = 1; 
        } else { 
            this.phase = 0; 
            this.apply(StatusEffects.disarmed, 2); 
        }
    }
});
