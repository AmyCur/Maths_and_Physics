import { Mesh } from "../game_objects/Mesh.js";
import { ColliderUtils } from "../game_objects/Colliders.js";
import { Transform } from "../game_objects/Transform.js";
import { Buffer } from "./Buffer.js";

export const MeshCreator = {
  CreateMesh(gl, bufferData, components, properties, transform = Transform.default()) {
    const ib = this.CreateBuffer(gl, bufferData.position, bufferData.texCoords, bufferData.index);


    const BE = new Mesh(

      //* Buffer
      bufferData,

      //* Transform
      transform,

      //* Components
      components,
      properties,

      new Buffer(
        ib.positionBuffer,
        ib.textureBuffer,
        ib.indexBuffer,
      ),
    );

    return BE;
  },

  CreateBuffer(gl, positions, uv, indices) {
    const positionBuffer = this.CreatePositionBuffer(gl, positions);
    const textureBuffer = this.CreateTextureBuffer(gl, uv);
    const indexBuffer = this.CreateIndexBuffer(gl, indices);

    return {
      positionBuffer: positionBuffer,
      textureBuffer: textureBuffer,
      indexBuffer: indexBuffer,
    };
  },

  CreatePositionBuffer(gl, positions) {
    // Create a buffer for the square's positions.
    const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);



    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
  },

  //TODO Fix the tex coords not working
  CreateTextureBuffer(gl, texCoords) {
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);


    const tc = [
      // Front
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Back
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Top
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Bottom
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Right
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Left
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    ];

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(tc),
      gl.STATIC_DRAW,
    );

    return textureCoordBuffer;
  },


  CreateIndexBuffer(gl, indices) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.


    // Now send the element array to GL

    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );

    return indexBuffer;
  }
}

