import { Attack } from "../input/Attack.js";
import { input } from "../input/input.js";
import { Raycast } from "../input/Raycast.js";
import { Buffer } from "../rendering/Buffer.js";
import { MeshCreator } from "../rendering/MeshCreator.js";
import { textures } from "../rendering/Textures.js";
import { MathUtil, MUtil } from "../util/MathUtil.js";
import { Time } from "../util/Time.js";
import { VectorUtil } from "../util/VectorUtil.js";
import { Vector2 } from "../vectors/Vector2.js";
import { Vector3 } from "../vectors/Vector3.js";
import { camera } from "./camera.js";
import { ColliderUtils } from "./Colliders.js";
import { objects } from "./Objects.js";
import { Transform } from "./Transform.js";
import { TransObject } from "./TransObject.js";

"use strict";

class Player extends TransObject {
    idle = false;
    state = "walking"


    // The player is special because theyre not actually a rendered thing, hence the no scale or rotation
    constructor(data) {

        super({
            transform: data.transform,
            components: {},
            properties: {},
            velocity: {
                current: Vector3.zero(),
                min: -30,
                max: 30
            }
        })

        this.text = {
            position: document.getElementById("player-pos"),
            health: document.getElementById("Health"),
            stamina: document.getElementById("Stamina"),
            dev: document.getElementById("dev"),
        }

        this.gravityScale = 0.05;
        this.jumping = false;
        this.movementMode = "normal";

        this.health = 100
        this.jumpForce = data.jumpForce ;
        this.godMode = true;
        this.devMode = false;
        this.sprinting = false;

        this.angle = 0;

        this.speed = {
            base: 0.7,
            sprint: 0.8,
            current: 0.5
        };
        this.stamina = 100;

        this.attackRange = 30;

        this.velocityReductionSpeed=new Vector3(0.7, 0.9, 0.7);

        objects.trans.core.push(this);


        // I kinda love this
        this.attack = new Attack(0.3, 10, () => {
            if (!this.dead) {
                const attackDir = VectorUtil.GetCameraForwardVector();

                console.log(attackDir.Print());

                const hitObj = Raycast.ShootRay({
                    startPos: new Vector3(player.transform.position.x, player.transform.position.y + camera.transform.position.y, player.transform.position.z), 
                    direction: attackDir,
                    maxRange: this.attackRange
                });

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

    Slam(){
        this.AddVelocity(new Vector3(0,-10,0));
    }

    Dash(){
        this.gravityScale=0.05;
        const backwards = input.forwards(camera.transform.rotation.x);
        const forwards = VectorUtil.Invert(input.forwards(camera.transform.rotation.x));
        const left = backwards.Rotate(90);
        const right = VectorUtil.Invert(left);
        const movementVector=new Vector2(0,0);

        if(input.GetKey("KeyA")) movementVector.Add(left)
        
        if(input.GetKey("KeyD")){
            movementVector.Add(right)
        }

        if(input.GetKey("KeyS")){
            movementVector.Add(backwards);
        }
        else{
        movementVector.Add(forwards);

        }
        

        



        this.AddVelocity(VectorUtil.Multiply(VectorUtil.Normalize(movementVector.ToVector3()), 200));
    }

    HandleSprinting() {
        if (!this.Grounded()) {
            this.stamina += 0.1;
        }
        else {
            if (!this.Moving()) {
                this.stamina += 0.1;
            }
            else {
                this.stamina += 0.025;
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


    Gravity() {
        if (this.Grounded()) {
            this.gravityScale = 0.05;
            // this.transform.position.y = 0;
        }

        else {
            this.gravityScale *= 1.05


            this.AddVelocity(new Vector3(0, -this.gravityScale, 0));
        }
}

    Jump() {
        this.gravityScale=0.05;
        if(!this.jumping) this.AddVelocity(new Vector3(0, this.jumpForce, 0));
        this.jumping = true;
        
        setTimeout(() => this.jumping = false, 600);
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

        
        if(this.transform.position.y < -300){
            this.transform.position=new Vector3(0,20,0);
            this.velocity.current=Vector3.zero();
        }

        this.health = MUtil.clamp(this.health, 0, 100);

        if (!this.dead) {
            this.Gravity();
            this.UpdatePosition();

            if(input.GetKeyThisFrame("ShiftLeft")) this.Dash();
            if(input.GetKeyThisFrame("ControlLeft")) this.Slam();
            if (input.GetKeyThisFrame("Space") && (player.Grounded() && !this.jumping)) player.Jump();

            this.angle++;

            if (this.angle >= 360) this.angle = 0;

            const rayObj = Raycast.ShootRay({
                startPos: this.transform.position, 
                direction: Vector3.down(),
                maxRange: 2
            });

            this.GetTriggerHits(rayObj);


        }

        for(let key in input.keysDownThisFrame){
            input.keysDownThisFrame[key]=false;
        }

    }


    UpdatePosition() {
        // player.transform.position = ColliderUtils.MoveWithRespect(player.transform.position, player.GetMovementInput());
        this.AddVelocity(this.GetMovementInput());
    }

}

export const player = new Player(
    {
        transform: {
            position: new Vector3(0, 20, -200),
            rotation: new Vector3(0, 0, 0),
            scale: new Vector3(1, 1, 1)
        }, 
        jumpForce: 8,
    }
);