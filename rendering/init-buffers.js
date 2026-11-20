import { BufferObject } from "../game_objects/BufferObject.js";
import { RenderObject } from "./RenderObject.js";

export const BufferCreator = {
  CreateBufferFromRenderObject(gl, renderObj, components) {
    const ib = this.CreateBuffer(gl, renderObj.positions, renderObj.colors, renderObj.indices);

    const BE = new BufferObject(
      //* Buffers
      {
        position: ib.positionBuffer,
        color: ib.colorBuffers,
        index: ib.indexBuffer,
      },

      //* Transform
      renderObj.transform,

      //* Render Object
      renderObj,

      //* Components
      components
    );

    return BE;
  },

  CreateBuffer(gl, positions, colors, indices) {
    const positionBuffer = this.CreatePositionBuffer(gl, positions);
    const colorBuffer = this.CreateColorBuffer(gl, colors);
    const indexBuffer = this.CreateIndexBuffer(gl, indices);

    return {
      positionBuffer: positionBuffer,
      colorBuffers: colorBuffer,
      indexBuffer: indexBuffer,
    };
  },

  CreateNewEnemyBuffer(gl, enemy) {
    const renderObj = new RenderObject().MakeCube();
    renderObj.colors = renderObj.SetColor("blue");

    const eb = BufferCreator.CreateBufferFromRenderObject(gl, renderObj, { enemy: enemy });

    eb.components.collider = new BoxCollider(new Vector3(0, 0, 0), new Vector3(1, 1, 1));
    eb.properties.name = "enemy";

    return eb;
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

  CreateColorBuffer(gl, faceColors) {


    // Convert the array of colors into a table for all the vertices.

    var colors = [];

    for (var j = 0; j < faceColors.length; ++j) {
      const c = faceColors[j];
      // Repeat each color four times for the four vertices of the face
      colors = colors.concat(c, c, c, c);
    }

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    return colorBuffer;
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

