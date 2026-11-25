import { Attack } from "../input/Attack.js";
import { input } from "../input/input.js";
import { Raycast } from "../input/Raycast.js";
import { Buffer } from "../rendering/Buffer.js";
import { MeshCreator } from "../rendering/BufferManager.js";
import { textures } from "../rendering/Textures.js";
import { MUtil } from "../util/MathUtil.js";
import { Time } from "../util/Time.js";
import { VectorUtil } from "../util/VectorUtil.js";
import { Vector2 } from "../vectors/Vector2.js";
import { Vector3 } from "../vectors/Vector3.js";
import { camera } from "./camera.js";
import { ColliderUtils } from "./Colliders.js";
import { objects } from "./Objects.js";
import { Transform } from "./Transform.js";
import { TransObject } from "./TransObject.js";

class Player extends TransObject {
    "use strict";
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
        this.sprinting = false;

        this.angle = 0;

        this.speed = {
            base: 1,
            sprint: 1.3,
            current: 1
        };
        this.stamina = 100;

        this.attackRange = 30;


        // I kinda love this
        this.attack = new Attack(0.3, 10, () => {
            if (!this.dead) {
                const attackDir = VectorUtil.GetCameraForwardVector();

                console.log(attackDir.Print());

                const hitObj = Raycast.ShootRay(new Vector3(player.transform.position.x, player.transform.position.y + camera.transform.position.y, player.transform.position.z), attackDir, this.attackRange, this.gl);

                if (hitObj?.IsEnemy()) {
                    console.log("Hit");
                    hitObj.components.enemy.TakeDamage(this.attack.damage);
                }



                this.attack.Cooldown();
            }

        });
    }

    Die() {
        this.dead = true;
        let t = 0;
        const cp = camera.transform.position.y;

        // Minecraft reference
        const interval = setInterval(() => {
            camera.transform.position = new Vector3(camera.transform.position.x, MUtil.lerp(cp, 0, t), camera.transform.position.z);
            t += 0.005;
            if (t >= 1) clearInterval(interval);
        }, 0)

    }

    TakeDamage(damage) {
        if (!this.godMode) this.health -= damage;
        if (this.health <= 0 && !this.dead) this.Die();
    }

    Attack() {
        this.attack.CheckCD();
    }

    Moving() {
        return this.velocity > 0.1;
    }

    HandleSprinting() {
        if(!this.Grounded()){
            this.stamina+=0.1;
        }
        else{
            if (!this.Moving()) {
                this.stamina += 0.1;
            }
            else{
                this.stamina+=0.025;
            }
        }
        

        this.sprinting = input.GetKey("ShiftLeft") && this.Grounded() && this.stamina > 0;

        if (this.sprinting) {
            this.speed.current = this.speed.sprint;

            if (this.Moving()) this.stamina -= 0.2;
        }
        else {

            this.speed.current = this.speed.base;
        }

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


        return VectorUtil.Multiply(VectorUtil.Normalize(movementVector.ToVector3()), this.speed.current * (MUtil.clamp(player.health / 100, 0.6, 1)));
    }

    Grounded() {
        const obj = Raycast.ShootRay(this.transform.position, Vector3.down(), 1, player.gl);
        return obj !== undefined;
    }

    Gravity() {
        if (this.Grounded() || this.jumping) {
            this.gravityScale = 7;
            // this.transform.position.y = 0;
        }

        else {
            this.gravityScale *= 1.01
            const distancePerTick = MUtil.clamp(this.gravityScale * 0.1, 0, (this.position + (this.gravityScale * 0.1)));

            this.velocity=VectorUtil.Add(this.velocity, new Vector3(0, -distancePerTick, 0));
        }
    }

    Jump() {
        this.jumping = true;
        // let i = 0;
        // let vta = this.jumpForce*2;
        // const interval = setInterval(() => {
        //     vta=MUtil.lerp(this.jumpForce, this.jumpForce*3, i/150);
        //     this.transform.position = ColliderUtils.MoveWithRespect(this.transform.position, new Vector3(0, vta, 0));
        //     // this.transform.position.y += this.jumpForce;
        //     i++;
        //     if (i >= 150 || this.Grounded()) clearInterval(interval);
        // }, 1 * Time.deltaTime)

        // console.log("FIN");
        this.jumping = false;
    }

    GetCollisions() {
        return ColliderUtils.IsColliding(this.transform.position, Vector3.zero);
    }

    GetTriggerHits(rayObj) {
        const medKit = rayObj?.components.medKit;
        if (medKit !== undefined && this.health !== 100) {
            objects.RemoveItemFromArray(rayObj, objects.mesh.other);
            player.health += medKit.heal;
        }
    }

    Update() {

        this.health = MUtil.clamp(this.health, 0, 100);

        if (!this.dead) {
            this.GetMovementInput();
            this.Gravity();
            this.UpdatePosition();

            if (input.GetKey("Space") && (player.Grounded() && !player.jumping)) player.Jump();

            this.angle++;
            if (this.angle >= 360) this.angle = 0;

            const rayObj = Raycast.ShootRay(this.transform.position, Vector3.down(), player.transform.scale.y / 2, this.gl);
            this.GetTriggerHits(rayObj);


        }
    }


    UpdatePosition() {
        // player.transform.position = ColliderUtils.MoveWithRespect(player.transform.position, player.GetMovementInput());
        this.velocity = player.GetMovementInput();
    }

}

export const player = new Player({
    position: new Vector3(0, 10, 0),
    rotation: new Vector3(0, 0, 0),
    scale: new Vector3(1, 10, 1)
}, 15);