const exponentialTurret = extend(ItemTurret, "exponential-progressor", {
    shotCounter: 0,
    damageSequence: [2, 4, 8, 16, 32, 64, 128, 256, 512],
    
    shoot(targetX, targetY, shootX, shootY, rotation) {
        let damage = this.damageSequence[this.shotCounter % this.damageSequence.length];
        this.shotCounter++;
        
        let originalType = this.ammoType;
        
        let modifiedBullet = originalType.copy();
        modifiedBullet.damage = damage;
        this.ammoType = modifiedBullet;
        
        this.super$shoot(targetX, targetY, shootX, shootY, rotation);
        this.ammoType = originalType;
    }
});

exports["exponential-progressor"] = exponentialTurret;
