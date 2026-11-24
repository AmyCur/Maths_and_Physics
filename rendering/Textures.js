//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.

import { Random } from "../util/Random.js";

//


function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}

export const textures = {
    paths: {
        stone: "/assets/stone.png",
        goomba: "/assets/goomba.png",
        null: "/assets/null.png",
        health_pack: "/assets/health_pack.png",
        tung: "/assets/tung.webp",
    },

    loadTexture(gl, url) {
        const texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);

        const noTexColor = new Uint8Array([255, 0, 255, 255]);

        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            1,
            1,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            noTexColor,
        );

        const image = new Image();
        image.src = url;


        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                image,
            );

            // I think this should make it pixelated, alas it doesnt
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_Mag_FILTER, gl.NEAREST);

            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {

                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            }
        };

        image.onerror = () => {
            console.warn("Error loading texture");
        }

        return texture;
    },

    GetRandomTexture() {
        const ts = [];
        for (let prop in textures.paths) {
            ts.push(prop);
        }

        // Why does this work, js is an evil, evil language
        return this.paths[ts[Random.RandInt(0, ts.length - 1)]]
    }
}
