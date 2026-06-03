const CORE_NAME = "core-n";
const POWER_AMOUNT = 500;

let generators = {};

Events.run(Trigger.update, () => {
    let cores = Vars.state.teams.playerCores();
    for (let i = 0; i < cores.size; i++) {
        let coreBuild = cores.get(i);
        if (coreBuild && coreBuild.block.name === CORE_NAME) {
            if (!generators[coreBuild.id]) {
                generators[coreBuild.id] = true;
                coreBuild.consumesPower = true;
                coreBuild.outputsPower = true;
                coreBuild.power.graph.add(POWER_AMOUNT / 60);
            }
            coreBuild.power.graph.add(POWER_AMOUNT / 60);
        }
    }
});

Events.on(ClientLoadEvent, () => {
    print("scripts activatededed");
});