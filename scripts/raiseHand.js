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

        handButton[0].addEventListener('click', ev => View.HandleRequest(ev, game.userId));
    }    
}

class View {
    static async HandleRequest(event, userId) {
        console.log(`player ${userId} has raised their hand`);

        const playerList = $(document)
        .find("aside#players.app")
        .find("ol")
        .find("li");
        for (const player of playerList) {
            const user = await fromUuid(`User.${$(player).attr("data-user-id")}`);
            console.log(`... checking player list user ${user._id}`)
            if (user._id == userId) {
                console.log("Match!")
                $(player)
                .children()
                .last()
                .append(`<span>*</span>`);
            }
        }
    }
}

Hooks.on('renderSceneControls', (controls, html) => {
    Control.Init(controls, html);
});

console.log("Raise Your Hand module loaded");