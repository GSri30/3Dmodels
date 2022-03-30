import { vec3, vec4, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

class WebGLRenderer{
	constructor(doc, id){
		this.domElement = doc.getElementById(id);
		this.gl = this.domElement.getContext("webgl",{preserveDrawingBuffer: true}) || this.domElement.getContext("experimental-webgl");
		if (!this.gl) throw new Error("WebGL is not supported");

		this.setSize(50,50);
		this.clear(1.0,1.0,1.0,1.0);
	}	

	setSize(width, height){
		this.domElement.width = width;
		this.domElement.height = height;
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	}

	clear(r,g,b,a){
		this.gl.clearColor(r, g, b, a);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}

	setAnimationLoop(animation){
		function renderLoop()
		{
			animation();
			window.requestAnimationFrame(renderLoop);
		}	

		renderLoop();
		  
	}

	render(scene, shader, viewMatrix, projMatrix){
		scene.primitives.forEach( function (primitive) {

			primitive.transform.updateModelTransformMatrix();

			shader.bindArrayBuffer(shader.vertexAttributesBuffer, primitive.vertexArray);
			shader.bindElementBuffer(shader.indexBuffer, primitive.vertexIndices);
			
			shader.fillAttributeData("a_position", 3,  3 * primitive.vertexArray.BYTES_PER_ELEMENT, 0);

			shader.setUniform4f("u_color", primitive.color);

			shader.setUniformMatrix4fv("model_matrix",primitive.transform.modelTransformMatrix);
			shader.setUniformMatrix4fv("view_matrix",viewMatrix);
			shader.setUniformMatrix4fv("proj_matrix",projMatrix);
			
			// Draw
			shader.drawElements(primitive.vertexIndices.length);
		});
	}

	glContext(){
		return this.gl;
	}

	getPixelCoordinates(canvas, clientX, clientY){
		const rect = canvas.getBoundingClientRect();
		let x = clientX - rect.left;
		let y = clientY - rect.top;
	
		return [x * canvas.width / canvas.clientWidth, canvas.height - y * canvas.height / canvas.clientHeight - 1];
	}

	mouseToClipCoord(mouseX, mouseY){
		return [(2*((mouseX)/this.domElement.width))-1,(2*((-mouseY)/this.domElement.height))+1];
	}

	clipToWorld(p, viewMatrix, projMatrix){
		let view_projection_mat = mat4.create();
		mat4.multiply(view_projection_mat, projMatrix, viewMatrix);
	
		let inv_view_projection_mat = mat4.create();
		mat4.invert(inv_view_projection_mat, view_projection_mat);
	
		// check
		let p3d = vec3.fromValues(p[0], p[1], 0.934);
		let world_coordinates = vec3.create();
	
		vec3.transformMat4(world_coordinates, p3d, inv_view_projection_mat);
	
		return world_coordinates;
	}

	mouseToWorld(mouse, viewMatrix, projMatrix){
		return this.clipToWorld(this.mouseToClipCoord(mouse[0], mouse[1]), viewMatrix, projMatrix);
	}

	getEyeUp(rotationAngle, rotationAxis, eye, up){
		
		let aVector;
		if(rotationAxis == 'x') aVector = [1,0,0];
		else if(rotationAxis == 'y') aVector = [0,1,0];
		else aVector = [0,0,1];

		let transMat = mat4.create();
		mat4.identity(transMat);

		let eyeHomo = [eye[0], eye[1], eye[2], 1];
		mat4.rotate(transMat, transMat, rotationAngle, aVector);
		vec4.transformMat4(eyeHomo, eyeHomo, transMat);
		eye = eyeHomo;

		let upHomo = [up[0], up[1], up[2], 1];
		mat4.identity(transMat);
		mat4.rotate(transMat, transMat, rotationAngle, aVector);
		vec4.transformMat4(upHomo, upHomo, transMat);
		up = upHomo;

		return [eye, up];
	}
}

export{
	WebGLRenderer,
}