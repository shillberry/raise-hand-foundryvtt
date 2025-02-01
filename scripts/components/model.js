import { MODULE_NAME, module_log } from "../settings.js";

export class Model {
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