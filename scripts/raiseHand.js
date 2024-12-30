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
    static dataControl = "raise-your-hand"

    static async Init(controls, html) {

        const handButton = $(
            `
            <li class="scene-control" data-control="${this.dataControl}" title="Raise Hand">
                <i class="fa-solid fa-hand"></i>
            </li>
            `
        );

        html.find(".main-controls").append(handButton);

        handButton[0].addEventListener('click', _ => View.HandleRequest(game.userId));
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
            if (this.raised === true) {
                $(player)
                    .children()
                    .find(`#raised`) // should be able to use 'input[state="raised"]'
                    .remove();
                this.raised = false;
                module_log("info", `player ${$(player).attr("data-user-id")} has lowered their hand`);
            } else {
                $(player)
                    .children()
                    .last()
                    .prepend(`<span id="raised">${this.symbol}</span>`);
                this.raised = true;
                module_log("info", `player ${$(player).attr("data-user-id")} has raised their hand`);
            }
        }
    }
}

Hooks.on('renderSceneControls', (controls, html) => {
    Control.Init(controls, html);
});

module_log("info", "module loaded");