import { MODULE_NAME, module_log } from "../settings.js";
import { Model } from "./model.js";

export class Control {
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
                game.audio.constructor.play({
                    src: game.settings.get("raise-your-hand", "sound_effect")
                },
                true
            );
        }
    }
}