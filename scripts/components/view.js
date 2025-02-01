import { Model } from "./model.js";

export class View {
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