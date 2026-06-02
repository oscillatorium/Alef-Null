Events.on(ClientLoadEvent, () => {
    Vars.ui.hudfrag.showToast("Test", "Скрипты работают!");
    print("Test message in console");
});