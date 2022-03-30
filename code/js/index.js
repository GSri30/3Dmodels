import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';
import { initShapes } from './data/shapes.js';
import { SHADERS } from './data/shaders.js';
import { Shader } from './utils/shader-utils.js';
import { WebGLRenderer } from './utils/canvas-utils.js';
import { abc, p_t } from './helpers/math.js';
import { SELECTED_SHAPE_COLOR, WIDTH, HEIGHT, ROTATION_SPEED } from './constants.js';
import { downloadCanvas } from './utils/download-utils.js';

async function init(){
	let MODE = 1;
	let ANIMATION = 0;
	let ANIMATION_CLICK_STATE = 0;
	let MOVEMENT = 0;
	let SHAPE = undefined;
	let MOUSE_LOCATION_PREV_STATE = undefined;
	let p0, p1, p2, t=0;

	let viewMatrix = mat4.create();
	let projMatrix = mat4.create();

	let eye = vec3.create();
	vec3.set(eye, 0, 0, 3);
	
	let up = vec3.create();
	vec3.set(up, 0, 1, 0);
	let CameraRotationAxis = 'y';

	updateViewProj(eye, up);

	let scene = await initShapes();
	function animation(){
		renderer.clear(0.9, 0.9, 0.9, 1);
		renderer.render(scene, shader, viewMatrix, projMatrix);
		animate()
	}

	const renderer = new WebGLRenderer(document, 'surface');
	renderer.setSize( WIDTH, HEIGHT );
	document.body.appendChild( renderer.domElement );

	const shader = new Shader(renderer.glContext(), SHADERS[0], SHADERS[1]);
	shader.use();
	renderer.setAnimationLoop(animation);

	let canvas = renderer.domElement;
	let gl = renderer.gl;

	document.addEventListener('keyup', (event) => {
		if(event.key == 'q'){
			if(MODE == 1){
				MODE = 2;
				vec3.set(eye, 3, 3, 3);
				mat4.lookAt(viewMatrix, eye, [0,0,0], up);
			}else{
				MODE = 1;
				vec3.set(eye, 0, 0, 3);
				mat4.lookAt(viewMatrix, eye, [0,0,0], up);
			}
		}
	})

	document.addEventListener('keydown', (event) => {

		if(event.key == 'ArrowRight') SHAPE.transform.moveX(0.1);
		else if(event.key == 'ArrowLeft') SHAPE.transform.moveX(-0.1);
		else if(event.key == 'ArrowUp') SHAPE.transform.moveY(0.1);
		else if(event.key == 'ArrowDown') SHAPE.transform.moveY(-0.1);
		else if(event.key == 'm') SHAPE.transform.moveZ(0.1);
		else if(event.key == 'n') SHAPE.transform.moveZ(-0.1);
		else if(event.key == 'z') SHAPE.transform.rotateX(0.1);
		else if(event.key == "c") SHAPE.transform.rotateX(-0.1);
		else if(event.key == 't') SHAPE.transform.rotateY(0.1);
		else if(event.key == "u") SHAPE.transform.rotateY(-0.1);
		else if(event.key == 'a') SHAPE.transform.rotateZ(0.1);
		else if(event.key == "s") SHAPE.transform.rotateZ(-0.1);
		else if(event.key == '+') SHAPE.transform.scalePos(0.1);
		else if(event.key == "-") SHAPE.transform.scaleNeg(0.1);
		else if(event.key == "x") CameraRotationAxis = 'x';
		else if(event.key == "y") CameraRotationAxis = 'y';
		else if(event.key == "z") CameraRotationAxis = 'z';
		else if(event.key == "w"){
			if(MODE == 1) ANIMATION = 1-ANIMATION;
		}
		else if(event.key == '5'){
			if(MODE == 2){
				eye[0] -= 0.1;
				eye[1] -= 0.1;
			}
			eye[2] -= 0.1;
			mat4.lookAt(viewMatrix, eye, [0,0,0], up);
		}
		else if(event.key == "6"){
			if(MODE == 2){
				eye[0] += 0.1;
				eye[1] += 0.1;
			}
			eye[2] += 0.1;
			mat4.lookAt(viewMatrix, eye, [0,0,0], up);
		}
	}, false);

	canvas.addEventListener('mousedown', (event) => {
		if(MODE == 1 && ANIMATION == 0){
			
			let [x, y] = renderer.getPixelCoordinates(canvas, event.clientX, event.clientY);

			const data = new Uint8Array(4);
			renderer.render(scene, shader, viewMatrix, projMatrix);
			renderer.gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);
			
			let previous_shape = SHAPE;
			SHAPE = scene.nearestSHAPE(data);
			
			if(previous_shape)
				previous_shape.color = previous_shape.original_color;
			if(SHAPE){
				SHAPE.color = SELECTED_SHAPE_COLOR;
			}
		}
		else if((MODE == 1) && (ANIMATION == 1)){
			if(ANIMATION_CLICK_STATE == 0){
				ANIMATION_CLICK_STATE = 1;
				p0 = SHAPE.centroid();
				p1 = renderer.mouseToWorld([event.clientX,event.clientY], viewMatrix, projMatrix);
			}
			else if(ANIMATION_CLICK_STATE == 1){
				ANIMATION_CLICK_STATE = 0;
				p2 = renderer.mouseToWorld([event.clientX,event.clientY], viewMatrix, projMatrix);
			}
		}
		else if(MODE == 2){
			MOVEMENT = 1-MOVEMENT;
			MOUSE_LOCATION_PREV_STATE = event.clientX;
		}
	});

	canvas.addEventListener('mousemove', (event) => {
		if((MODE == 2) && (MOVEMENT == 1)){
			let rotationAngle = -ROTATION_SPEED * (event.clientX - MOUSE_LOCATION_PREV_STATE);
			[eye, up] = renderer.getEyeUp(rotationAngle, CameraRotationAxis, eye, up);
			updateViewProj(eye, up);
			MOUSE_LOCATION_PREV_STATE = event.clientX;
		}
	});

	function animate(){
		if(!SHAPE || !p0 || !p1 || !p2 || !ANIMATION)
			return;
		else if(ANIMATION == 1){
			if(t<1){
				let [ax, bx, cx] = abc(p0[0], p1[0], p2[0], 0.5);
				let [ay, by, cy] = abc(p0[1], p1[1], p2[1], 0.5);
				let [az, bz, cz] = abc(p0[2], p1[2], p2[2], 0.5);

				let tempX = SHAPE.transform.getTranslateX();
				let tempY = SHAPE.transform.getTranslateY();
				let tempZ = SHAPE.transform.getTranslateZ();

				tempX[0] = p_t(ax, bx, cx, t);
				tempY[1] = p_t(ay, by, cy, t);
				tempZ[2] = p_t(az, bz, cz, t);
		
				SHAPE.transform.setTranslateX(tempX);
				SHAPE.transform.setTranslateY(tempY);
				SHAPE.transform.setTranslateZ(tempZ);

				t +=0.005;
			}
			else{
				t=0;
				ANIMATION = 0;
				if(SHAPE) SHAPE.color = SHAPE.original_color;
				SHAPE = undefined;
				p0 = undefined;
				p1 = undefined;
				p2 = undefined;
			}
		}
	}

	function updateViewProj(_eye, _up){
		mat4.lookAt(viewMatrix, _eye, [0,0,0], _up);
		mat4.perspective(projMatrix, 45*Math.PI/180, 1, 0.1, 1000);
	}
}

window.onload = init;
document.querySelector('.download').addEventListener('click', () => downloadCanvas(document, 'surface'));