export const Texturing = {
    loadTexture(gl, url){
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
            gl.UNSIGNED_BYTE, 
            new Uint8Array([255,0,255,255])
        );

        const image = new Image();
        image.src=url;
        console.log(image.src)
        image.onload = () => {
            console.log("load");
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        }

        return texture;
    }
}