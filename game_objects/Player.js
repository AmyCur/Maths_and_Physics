import { Attack } from "../input/Attack.js";
import { Raycast } from "../input/Raycast.js";
import { MUtil } from "../util/MathUtil.js";
import { Time } from "../util/Time.js";
import { VectorUtil } from "../util/VectorUtil.js";
import { Vector3 } from "../vectors/Vector3.js";
import { camera } from "./camera.js";
import { Entity } from "./Entity.js";
import { GameObject } from "./GameObject.js";

class Player extends Entity {

    // The player is special because theyre not actually a rendered thing, hence the no scale or rotation
    constructor(position, jumpForce) {
        super(position, new Vector3(1, 1, 1), new Vector3(0, 0, 0), 100);
        this.gravityScale = 1;
        this.jumping = false;
        this.text = document.getElementById("player-pos");
        this.healthText = document.getElementById("player-health");
        this.jumpForce = jumpForce / 100;
        this.godMode = true;
        this.attack = new Attack(0.2, 10);
    }

    UpdateUI() {
        this.text.innerHTML = this.position.Print();
        this.healthText.innerHTML = `Health: ${this.health}`;
    }

    TakeDamage(damage) {
        if (!this.godMode) this.health -= damage;
        if (this.health <= 0) this.Die();
    }

    SetPos(position) {
        this.position = position;
    }

    Attack() {
        if (this.attack.onCD) this.attack.CheckCD();
        else {

            
            
            // console.log(`x: ${alpha}, y: ${beta}`);

            const attackDir = VectorUtil.GetCameraForwardVector();

            console.log(attackDir.Print());

            const hitObj = Raycast.ShootRay(new Vector3(-player.position.x,-player.position.y,-player.position.z), attackDir, 10);

            hitObj?.TakeDamage(this.attack.damage);



            this.attack.Cooldown();
        }
    }

    Grounded() {
        return this.position.y >= 0;
    }

    Gravity() {
        if (this.Grounded() || this.jumping) {
            this.gravityScale = 1;
            this.position.y = 0;
        }

        else {
            this.gravityScale *= 1.041
            const distancePerTick = MUtil.clamp(this.gravityScale * 0.1, 0, (this.position + (this.gravityScale * 0.1)));
            this.position.y += distancePerTick;
        }
    }

    Jump() {
        this.jumping = true;
        let i = 0;
        const interval = setInterval(() => {
            this.position.y -= this.jumpForce;
            i++;
            if (i >= 150 || this.Grounded()) clearInterval(interval);
        }, 1 * Time.deltaTime)


        this.jumping = false;
    }
}

export const player = new Player(new Vector3(0, 0, 0), 15);