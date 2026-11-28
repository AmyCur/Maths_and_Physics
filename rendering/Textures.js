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
        tung: "/assets/tung.png",
        grass: "/assets/grass.png"
    },

    loadTexture(gl, url) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            1,
            1,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE, new Uint8Array([255,255,255,255])
        );

        const image = new Image();
        image.src=url;

        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
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
