const CORE_NAME = "core-n";
const POWER_AMOUNT = 500;

let generator = null;

Events.on(ClientLoadEvent, () => {
    print("scripts activated");
});

Events.run(Trigger.update, () => {
    let cores = Vars.state.teams.playerCores();
    for (let i = 0; i < cores.size; i++) {
        let coreBuild = cores.get(i);
        if (coreBuild && coreBuild.block.name === CORE_NAME) {
            if (!generator) {
                generator = new PowerGraph();
            }
            generator.add(POWER_AMOUNT / 60);
            coreBuild.power.graph = generator;
        }
    }
});