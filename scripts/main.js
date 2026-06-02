const CORE_NAME = "core-n";
const POWER_PER_TICK = 500 / 60;

Events.on(ClientLoadEvent, () => {
    print("scripts activated");
});

Events.run(Trigger.update, () => {
    let cores = Vars.state.teams.playerCores();
    for (let i = 0; i < cores.size; i++) {
        let coreBuild = cores.get(i);
        if (coreBuild && coreBuild.block.name === CORE_NAME) {
            coreBuild.items.add(Items.power, POWER_PER_TICK);
        }
    }
});