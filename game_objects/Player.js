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
import { TransObject } from "./TransObject.js";

class Player extends TransObject{
    "use strict";
    velocity = 0;
    idle = false;

    // The player is special because theyre not actually a rendered thing, hence the no scale or rotation
    constructor(transform, jumpForce) {

        super(transform, {}, {})

        this.text = {
            position: document.getElementById("player-pos"),
            health: document.getElementById("Health"),
            stamina: document.getElementById("Stamina"),
            dev: document.getElementById("dev"),
        }

        this.gravityScale = 1;
        this.jumping = false;
        this.movementMode = "normal";

        this.health = 100
        this.jumpForce = jumpForce / 100;
        this.godMode = true;
        this.devMode = false;

        this.speed = {
            base: 1,
            sprint: 1.3,
            current: 1
        };
        this.stamina = 100;


        // I kinda love this
        this.attack = new Attack(0.3, 10, () => {

            const attackDir = VectorUtil.GetCameraForwardVector();

            console.log(attackDir.Print());

            const hitObj = Raycast.ShootRay(new Vector3(player.transform.position.x, player.transform.position.y+camera.transform.position.y, player.transform.position.z), attackDir, 10, this.gl);

            if (hitObj?.IsEnemy()) {
                console.log("Hit");
                hitObj.components.enemy.TakeDamage(this.attack.damage);
            }



            this.attack.Cooldown();
        });
    }



    TakeDamage(damage) {
        if (!this.godMode) this.health -= damage;
        if (this.health <= 0) this.Die();
    }

    Attack() {
        this.attack.CheckCD();
    }

    Moving() {
        return this.velocity > 0.1;
    }

    HandleSprinting() {
        if (!this.Moving() || !this.Grounded()) this.stamina += 0.1;

        if (input.GetKey("ShiftLeft") && this.Grounded()) {
            this.speed.current = this.speed.sprint;
            if (this.Moving()) this.stamina -= 0.2;
        }
        else this.speed.current = this.speed.base;

        this.stamina = MUtil.clamp(this.stamina, 0, 100)
    }


    GetMovementInput() {

        this.HandleSprinting();

        const forwards = input.forwards(camera.transform.rotation.x);

        const backwards = VectorUtil.Invert(forwards);
        const right = forwards.Rotate(270);
        const left = VectorUtil.Invert(right);

        const movementVector = new Vector2(0, 0);

        if (input.GetKey("KeyW")) {

            movementVector.Add(backwards);
        }
        if (input.GetKey("KeyS")) {


            movementVector.Add(forwards);
        }
        if (input.GetKey("KeyD")) {
            movementVector.Add(right);
        }
        if (input.GetKey("KeyA")) {
            movementVector.Add(left);
        }

        // 0.1 of leeway to avoid floating point imprecision
        if (this.velocity > 0.1 && player.Grounded()) input.angle += 0.5;
        if (!player.Grounded()) input.angle = 0;
        // if(this.GetKey("Space")) 

        // console.log(movementVector);


        return VectorUtil.Multiply(VectorUtil.Normalize(movementVector.ToVector3()), this.speed.current);
    }

    Grounded() {
        const obj = Raycast.ShootRay(this.transform.position, Vector3.down(), 1, player.gl);
        return obj !== undefined;
    }

    Gravity() {
        if (this.Grounded() || this.jumping) {
            this.gravityScale = 3;
            // this.transform.position.y = 0;
        }

        else {
            this.gravityScale *= 1.01
            const distancePerTick = MUtil.clamp(this.gravityScale * 0.1, 0, (this.position + (this.gravityScale * 0.1)));
            
            this.transform.position = ColliderUtils.MoveWithRespect(this.transform.position, new Vector3(0, -distancePerTick, 0));
        }
    }

    Jump() {
        this.jumping = true;
        let i = 0;
        const interval = setInterval(() => {
            this.transform.position = ColliderUtils.MoveWithRespect(this.transform.position, new Vector3(0, this.jumpForce, 0));
            // this.transform.position.y += this.jumpForce;
            i++;
            if (i >= 150 || this.Grounded()) clearInterval(interval);
        }, 1 * Time.deltaTime)


        this.jumping = false;
    }

    UpdatePosition() {
        
        const cp = player.transform.position;
        if(cp.y < -1000 || cp.y>1000) console.log(cp);
        player.transform.position = ColliderUtils.MoveWithRespect(player.transform.position, player.GetMovementInput());
        this.velocity = VectorUtil.GetLength(VectorUtil.Subtract(cp, player.transform.position));
    }
}

export const player = new Player({
    position: new Vector3(0, 2, 0),
    rotation: new Vector3(0, 0, 0),
    scale: new Vector3(1, 10, 1)
}, 15);