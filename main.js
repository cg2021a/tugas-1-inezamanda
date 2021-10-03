function main(){
    /**
      * @type {HTMLCanvasElement} canvas
      */
     var canvas = document.getElementById("myCanvas");

     /**
       * @type {WebGLRenderingContext} gl
       */
     var gl = canvas.getContext("webgl");

     if(!gl) {
        console.log(`WebGL not supported, falling back on experimental`);
        gl = canvas.getContext("experimental-webgl");
    }

    if(!gl) {
        alert("Your browser does not support webgl");
    }

    var vertexShaderCode = `
    precision mediump float;
    attribute vec2 vertPosition;
    attribute vec3 vertColor;
    varying vec3 v_Color;
    // uniform float dx;
    // uniform float dy;
    // uniform float dz;
    uniform mat4 translasi;

    void main(){
        v_Color = vertColor;
        // mat4 translasi = mat4(
        //     1.0, 0.0, 0.0, 0.0,
        //     0.0, 1.0, 0.0, 0.0,
        //     0.0, 0.0, 1.0, 0.0,
        //     dx, dy, dz, 1.0
        // );
      gl_Position = translasi * vec4(vertPosition, 0.0, 2.0);
    }`;

    var fragmentShaderCode = `
    precision mediump float;
    varying vec3 v_Color;
    void main(){
        gl_FragColor = vec4(v_Color, 1.0);
    }`;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderCode)
    gl.shaderSource(fragmentShader, fragmentShaderCode);

    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('Error compiling vertex shader!' , gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Error compiling fragment shader!' , gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program! ', gl.getProgramInfoLog(program));
        return;
    }

    gl.validateProgram(program);
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error("ERROR validating program!", gl.getProgramInfoLog(program));
        return;
    }

    const vertices = [
        ...topFront,
        ...bottomFront,
        ...topRight,
        ...bottomRight
    ]
    
    let color = []

    for (let i = 0; i < vertices.length / 6; i++) {
        // let r = Math.random() / 2 + 0.45;
        // let g = Math.random() / 2 + 0.45;
        // let b = Math.random() / 2 + 0.45;
        let r = 216/255;
        let g = 202/255;
        let b = 198/255;
        for (let j = 0; j < 3; j++) {
            color.push(r);
            color.push(g);
            color.push(b);
            color.push(1);
        }
    }

    var vertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttribLocation, // attribut location
        2, // number of elements per attribute
        gl.FLOAT, // type of elements
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex
        0 // offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(positionAttribLocation);

    var colorBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);

    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        colorAttribLocation, // attribut location
        4, // number of elements per attribute
        gl.FLOAT, // type of elements
        gl.FALSE,
        4 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex
        0 // offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(colorAttribLocation);

    let dy=0;
    let speed = 0.0208;
    function render(){
        
        gl.clearColor(33/255, 33/255, 33/255, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if(dy>=0.72 || dy<=-0.74) {
            speed = speed * -1;
        }
         dy += speed;
         let translasiMatrix = [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            -0.5, 0.0, 0.0, 1.0
        ]
    
        const translasi = gl.getUniformLocation(program, "translasi");
        gl.uniformMatrix4fv(translasi, false, translasiMatrix);
    
        gl.drawArrays(gl.TRIANGLES, 0, 3*4);
         translasiMatrix = [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.5, dy, 0.0, 1.0
        ]
    
        gl.uniformMatrix4fv(translasi, false, translasiMatrix);
    
        gl.drawArrays(gl.TRIANGLES, (topFront.length + bottomFront.length)/2, 3*4);

        requestAnimationFrame(render);
    }
    render();
    
}