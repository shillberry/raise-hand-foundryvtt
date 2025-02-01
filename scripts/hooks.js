import { module_log, MODULE_NAME, SOUND_EFFECT_SETTING_NAME } from "./module.js";
import { Control } from "./components/control.js";
import { Model } from "./components/model.js";
import { View } from "./components/view.js";

Hooks.once('init', () => {
    game.settings.register(MODULE_NAME, SOUND_EFFECT_SETTING_NAME, {
        name: "Sound effect",
        hint: "Sound to play when hand is raised. If blank, no sound is played.",
        scope: "world",
        type: String,
        config: true,
        default: "sounds/notify.wav"
    });
})

Hooks.on('renderSceneControls', (controls, html) => {
    /* The model sets a flag in the user data, which triggers the updateUser hook.
     * Since the GM may not have the typical trappings of a user, we disable
     *  the control for the GM user.
    */
    if (!game.user.isGM) {
        Control.Init(controls, html);
    }
});

Hooks.once('ready', async function() {
    if (!game.user.isGM) {
        Model.Init(game.userId);
    }
})

Hooks.on("userConnected", (user, connected) => {
    // reset status when a user disconnects
    // for now, let a connected GM take care of this
    if (connected === false && game.user.isGM) {
        Model.RaiseHand(user, false);
    }
})

Hooks.on("updateUser", (user) => {
    ui.players.render();
})

Hooks.on("renderPlayerList", () => {
    View.RedrawPlayerList();
})

module_log("info", "module loaded");
