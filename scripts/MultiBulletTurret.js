Events.on(ContentInitEvent, () => {
    let turret = Vars.content.getByName(ContentType.block, "exponential-progressor");
    if (!turret) {
        print("exponential-progressor not found");
        return;
    }
    
    let originalFindAmmo = turret.findAmmo;
    
    turret.findAmmo = function(build) {
        let items = build.items;
        let entries = turret.ammoTypes.entries();
        let prevType = turret.ammoType;
        let prevItem = turret.ammoItem;
        
        if (items.total() == 0) {
            turret.ammoType = null;
            turret.ammoItem = null;
            return;
        }
        
        let found = false;
        let start = false;
        let firstItem = null;
        let firstType = null;
        
        for (let entry of entries) {
            let item = entry.key;
            let type = entry.value;
            
            if (!firstItem) {
                firstItem = item;
                firstType = type;
            }
            
            if (start && items.has(item) && type != prevType) {
                turret.ammoType = type;
                turret.ammoItem = item;
                found = true;
                break;
            }
            
            if (item == prevItem) {
                start = true;
            }
        }
        
        if (!found && firstItem && items.has(firstItem)) {
            turret.ammoType = firstType;
            turret.ammoItem = firstItem;
            found = true;
        }
        
        if (!found) {
            if (prevType && items.has(prevItem)) {
                turret.ammoType = prevType;
                turret.ammoItem = prevItem;
            } else {
                turret.ammoType = null;
                turret.ammoItem = null;
            }
        }
    };
    
    print("exponential-progressor modified");
});
