import { Enemy } from "../enemies/Enemy.js";
import { Attack } from "../input/Attack.js";
import { input } from "../input/input.js";
import { Raycast } from "../input/Raycast.js";
import { MUtil } from "../util/MathUtil.js";
import { Time } from "../util/Time.js";
import { VectorUtil } from "../util/VectorUtil.js";
import { Vector2 } from "../vectors/Vector2.js";
import { Vector3 } from "../vectors/Vector3.js";
import { camera } from "./camera.js";
import { ColliderUtils } from "./Colliders.js";
import { Entity } from "./Entity.js";
import { GameObject } from "./GameObject.js";
import { objects } from "./Objects.js";

class Player {
    "use strict";
    velocity=0;
    idle = false;

    // The player is special because theyre not actually a rendered thing, hence the no scale or rotation
    constructor(transform, jumpForce) {
        
        this.transform = {
            position: transform.position,
            rotation: transform.rotation,
            scale: transform.scale
        }

        this.gravityScale = 1;
        this.jumping = false;
        this.text = document.getElementById("player-pos");
        this.health=100
        this.healthText = document.getElementById("player-health");
        this.jumpForce = jumpForce / 100;
        this.godMode = true;
        
        // I kinda love this
        this.attack = new Attack(0.3, 10, () => {

            const attackDir = VectorUtil.GetCameraForwardVector();

            console.log(attackDir.Print());

            const hitObj = Raycast.ShootRay(new Vector3(player.transform.position.x, player.transform.position.y, player.transform.position.z), attackDir, 10);

            if(hitObj?.IsEnemy()) hitObj.components.enemy.TakeDamage(this.attack.damage);



            this.attack.Cooldown();
        });
    }

    UpdateUI() {
        this.text.innerHTML = this.transform.position.Print();
        this.healthText.innerHTML = `Health: ${this.health}`;
    }

    TakeDamage(damage) {
        if (!this.godMode) this.health -= damage;
        if (this.health <= 0) this.Die();
    }

    Attack() {
        this.attack.CheckCD();



    }


    GetMovementInput() {
        const forwards = input.forwards(camera.rotation.x);

        const backwards = forwards.Invert();
        const right = forwards.Rotate(270);
        const left = right.Invert();

        const movementVector = new Vector2(0, 0);
       

        if (input.GetKey("KeyW")) {
            input.movementDirectionVector.y += 1;
            movementVector.Add(backwards);
        }
        if (input.GetKey("KeyS")) {
            input.movementDirectionVector.y -= 1;

            movementVector.Add(forwards);
        }
        if (input.GetKey("KeyD")) {
            input.movementDirectionVector.x += 1;
            movementVector.Add(right);
        }
        if (input.GetKey("KeyA")) {
            input.movementDirectionVector.x -= 1;
            movementVector.Add(left);
        }

        if (input.movementDirectionVector.x !== 0 || input.movementDirectionVector.y !== 0) input.restingDirectionVector = input.movementDirectionVector;


        this.idle = input.movementDirectionVector.x !== 0 && input.movementDirectionVector.y !== 0;

        // 0.1 of leeway to avoid floating point imprecision
        if (this.velocity>0.1 && player.Grounded()) input.angle += 0.5;
        if (!player.Grounded()) input.angle = 0;
        // if(this.GetKey("Space")) 

        // console.log(movementVector);


        return VectorUtil.Normalize(movementVector.ToVector3());
    }

    Grounded() {
        return this.transform.position.y <= 0;
    }

    Gravity() {
        if (this.Grounded() || this.jumping) {
            this.gravityScale = 1;
            this.transform.position.y = 0;
        }

        else {
            this.gravityScale *= 1.041
            const distancePerTick = MUtil.clamp(this.gravityScale * 0.1, 0, (this.position + (this.gravityScale * 0.1)));
            this.transform.position.y -= distancePerTick;
        }
    }

    Jump() {
        this.jumping = true;
        let i = 0;
        const interval = setInterval(() => {
            this.transform.position.y += this.jumpForce;
            i++;
            if (i >= 150 || this.Grounded()) clearInterval(interval);
        }, 1 * Time.deltaTime)


        this.jumping = false;
    }

    UpdatePosition() {
        const cp = player.transform.position;
        player.transform.position = ColliderUtils.DetermineCollisionAndMove(player.transform.position, player.GetMovementInput());
        this.velocity=VectorUtil.GetLength(VectorUtil.Subtract(cp, player.transform.position));
    }
}

export const player = new Player({
    position: new Vector3(0, 0, 0),
    rotation: new Vector3(0, 0, 0),
    scale: new Vector3(1, 1, 1)
}, 15);