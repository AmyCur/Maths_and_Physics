import { camera } from "../game_objects/camera.js";
import { player } from "../game_objects/Player.js";
import { MathUtil, MUtil } from "../util/MathUtil.js";

export const UIManager = {
    devMode: true,
    text: {
        player: {
            position: document.getElementById("player-pos"),
            health: document.getElementById("Health"),
            stamina: document.getElementById("Stamina"),
        },
        camera: {
            rotation: document.getElementById("player-rot"),
        },
        dev: document.getElementById("dev")
    },

    UpdateUI(){
        this.text.camera.rotation.innerHTML = camera.transform.rotation.Print(MathUtil.Rad2Deg);
        this.text.player.position.innerHTML = player.transform.position.Print();
        this.text.player.health.innerHTML = player.health;
        this.text.player.stamina.innerHTML = player.stamina;

        if(!this.devMode) this.text.dev.innerHTML="";
    }
}