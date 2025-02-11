export const MODULE_NAME = "raise-your-hand";
export const SOUND_EFFECT_SETTING_NAME = "sound-effect";

export function module_log(severity, message) {
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
