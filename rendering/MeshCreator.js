import { Mesh } from "../game_objects/Mesh.js";
import { ColliderUtils } from "../game_objects/Colliders.js";
import { Transform } from "../game_objects/Transform.js";
import { Buffer } from "./Buffer.js";
import { GetShape } from "./shapes/Shapes.js";

export const MeshCreator = {
  CreateMesh(gl, meshData) {

    const bufferData = GetShape(meshData.shape);

    console.log(bufferData);
    const bufferInstance = this.CreateBuffer(gl, bufferData);

    if(meshData.properties===undefined) meshData.properties=Mesh.defaultProperties();
    if(meshData.components===undefined) meshData.components={};

    const mesh = new Mesh({
      //* Buffer
      bufferData: bufferData,

      //* Transform
      transform: meshData.transform,
      velocity: meshData.velocity,

      //* Components
      components: meshData.components,
      properties: meshData.properties,

      buffers: new Buffer(
        bufferInstance.positionBuffer,
        bufferInstance.textureBuffer,
        bufferInstance.indexBuffer,
      ),
    });

    if(meshData.targetArray!==undefined) meshData.targetArray(mesh);

    return mesh;
  },

  CreateBuffer(gl, data) {
    const positionBuffer = this.CreatePositionBuffer(gl, data.position);
    const textureBuffer = this.CreateTextureBuffer(gl, data.texCoord);
    const indexBuffer = this.CreateIndexBuffer(gl, data.index);

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

