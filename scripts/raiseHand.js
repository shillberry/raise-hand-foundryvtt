class Control {
    static dataControl = "raise-your-hand"

    static async Init(controls, html) {

        const handButton = $(
            `
            <li class="scene-control sdr-scene-control" data-control="${this.dataControl}" title="Simple Dice Roller">
                <i class="fa-solid fa-hand"></i>
            </li>
            `
        );

        html.find(".main-controls").append(handButton);

        handButton[0].addEventListener('click', ev => View.HandleRequest(game.userId));
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
            console.log(`... checking player list user ${$(p).attr("data-user-id")}`);
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
                    .find(`#raised`)
                    .remove();
                this.raised = false;
                console.log(`player ${$(player).attr("data-user-id")} has lowered their hand`);
            } else {
                $(player)
                    .children()
                    .last()
                    .prepend(`<span id="raised">${this.symbol}</span>`);
                this.raised = true;
                console.log(`player ${$(player).attr("data-user-id")} has raised their hand`);
            }
        }
    }
}

Hooks.on('renderSceneControls', (controls, html) => {
    Control.Init(controls, html);
});

console.log("Raise Your Hand module loaded");