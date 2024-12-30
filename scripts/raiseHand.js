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
            <li class="scene-control toggle" data-control="${this.dataControl}" title="Raise Hand">
                <i class="fa-solid fa-hand"></i>
            </li>
            `
        );

        html.find(".main-controls").append(control);
        this.button = control[0];

        this.button.addEventListener('click', _ => Model.HandleRequest(game.userId));
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
            user.setFlag(MODULE_NAME, this.#flagName, false);
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

    static async HandleRequest(userId) {
        let user = this.#getUserById(userId);
        if (user != null) {
            let currentState = user.getFlag(MODULE_NAME, this.#flagName);
            await user.setFlag(MODULE_NAME, this.#flagName, !currentState);
        }
    }
}

class View {
    static symbol = "✋";
    static async HandleRequest(user) {
        const playerList = $(document)
        .find("aside#players.app")
        .find("ol")
        .find("li");
        let player;
        for (const p of playerList) {
            if ($(p).attr("data-user-id") == user._id) {
                player = p;
                break;
            }
        }
        
        if (player) {
            let state = Model.IsHandRaised(user);
            if (state === false) {
                let marker = $(player)
                    .children()
                    .find(`#raised`); // should be able to use 'input[state="raised"]'
                marker?.remove();
                module_log("info", `${user.name} has lowered their hand`);
            } else {
                $(player)
                    .children()
                    .last()
                    .prepend(`<span id="raised">${this.symbol}</span>`);
                module_log("info", `${user.name} has raised their hand`);
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
    Model.Init(game.userId);
})

Hooks.on("updateUser", (user) => {
    module_log("info", `Received update for user ${user.name}`)
    View.HandleRequest(user);
})

module_log("info", "module loaded");