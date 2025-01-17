const MODULE_NAME = "raise-your-hand";

function module_log(severity, message) {
    let statement = MODULE_NAME + " | " + message;
    switch(severity) {
        case "error":
            console.error(statement);
            break;
        case "warn":
            console.warn(statement);
            break;
        default:
            console.log(statement);
    }
}

class Control {
    static dataControl = MODULE_NAME;
    static button;

    static async Init(controls, html) {

        const control = $(
            `
            <li class="scene-control toggle" data-control="${this.dataControl}" data-tooltip="Raise Hand">
                <i class="fa-solid fa-hand"></i>
            </li>
            `
        );

        html.find(".main-controls").append(control);
        this.button = control[0];

        this.button.addEventListener('click', _ => Model.ToggleHandState(game.userId));
        this.button.addEventListener('click', _ => this.Toggle());

        module_log("info", "Control init complete");
    }    

    static async Toggle() {
        if (this.button.classList.contains("active")) {
            this.button.classList.remove("active");
        } else {
            this.button.classList.add("active");
        }
    }
}

class Model {
    static #flagName = "handRaised";
    
    static #getUserById(userId) {
        return game.users.find(
            (u) => u._id == userId
        );
    }

    static async Init(userId) {
        let user = this.#getUserById(userId);
        if (user !== null) {
            this.RaiseHand(user, false)
            module_log("info", "Model init complete");
        }
    }

    static IsHandRaised(user) {
        if (user !== null) {
            return user.getFlag(MODULE_NAME, this.#flagName);
        } else {
            return null;
        }
    }

    static async RaiseHand(user, raised) {
        user.setFlag(MODULE_NAME, this.#flagName, raised);
    }

    static async ToggleHandState(userId) {
        let user = this.#getUserById(userId);
        if (user != null) {
            let currentState = user.getFlag(MODULE_NAME, this.#flagName);
            this.RaiseHand(user, !currentState);
        }
    }
}

class View {
    static symbol = "✋";
    static async RedrawPlayerList() {
        const playerList = $(document)
        .find("aside#players.app")
        .find("ol")
        .find("li");
        for (const player of playerList) {
            const user = await fromUuid(`User.${$(player).attr("data-user-id")}`);

            let state = Model.IsHandRaised(user);
            if (state === false) {
                let marker = $(player)
                    .children()
                    .find(`#raised`); // should be able to use 'input[state="raised"]'
                marker?.remove();
            } else if (state === true) {
                $(player)
                    .children()
                    .last()
                    .prepend(`<span id="raised">${this.symbol}</span>`);
            }
        }
    }
}

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