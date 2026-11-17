export class Mouse {
    constructor() {

    }

    LockMouse(canvas) {
        canvas.addEventListener("click", async () => {
            await canvas.requestPointerLock({
                unadjustedMovement: true,
            });
        });
    }
}

export const mouse = new Mouse();