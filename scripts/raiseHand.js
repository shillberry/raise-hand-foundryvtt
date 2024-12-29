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

        handButton[0].addEventListener('click', ev => View.Request(ev, html));
    }    
}

class View {
    static async Request(event, html) {
        console.log(`player ${game.userId} has raised their hand`);
    }
}

Hooks.on('renderSceneControls', (controls, html) => {
    Control.Init(controls, html);
});

console.log("Raise Your Hand module loaded");