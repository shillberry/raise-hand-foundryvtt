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
        } else {
            module_log("warn", "unable to set " + this.#flagName + " for user " + userId);
        }
    }

    static IsHandRaised(userId) {
        let user = this.#getUserById(userId);

        if (user !== null) {
            return user.getFlag(MODULE_NAME, this.#flagName);
        } else {
            module_log("warn", `unable to find user ${userId}`);
            return null;
        }
    }

    static async HandleRequest(userId) {
        let user = this.#getUserById(userId);

        if (user) {
            let currentState = user.getFlag(MODULE_NAME, this.#flagName);
            await user.setFlag(MODULE_NAME, this.#flagName, !currentState);
            // tmp
            View.HandleRequest(userId)
        }
    }
}

class View {
    static symbol = "✋";
    static async HandleRequest(userId) {
        const playerList = $(document)
        .find("aside#players.app")
        .find("ol")
        .find("li");
        let player;
        for (const p of playerList) {
            module_log("info", `... checking player list user ${$(p).attr("data-user-id")}`);
            if ($(p).attr("data-user-id") == userId) {
                console.log("Match!");
                player = p;
                break;
            }
        }
        
        if (player) {
            let state = Model.IsHandRaised(userId);
            if (state !== null) {
                 if (state === false) {
                    let marker = $(player)
                        .children()
                        .find(`#raised`); // should be able to use 'input[state="raised"]'
                    marker?.remove();
                    module_log("info", `player ${userId} has lowered their hand`);
                } else {
                    $(player)
                        .children()
                        .last()
                        .prepend(`<span id="raised">${this.symbol}</span>`);
                    module_log("info", `player ${userId} has raised their hand`);
                }
            } else {
                module_log("warn", `player ${userId} unknown request state`);
            }
        }
    }
}

Hooks.on('renderSceneControls', (controls, html) => {
    Control.Init(controls, html);
});

Hooks.once('ready', async function() {
    Model.Init(game.userId);
})

module_log("info", "module loaded");