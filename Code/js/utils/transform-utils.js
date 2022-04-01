import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

class Transform{
	constructor(){
		this.translateX = vec3.create();
		vec3.set(this.translateX, 0, 0, 0);
		
		this.translateY = vec3.create();
		vec3.set(this.translateY, 0, 0, 0);

		this.translateZ = vec3.create();
		vec3.set(this.translateZ, 0, 0, 0);

		this.scale = vec3.create();
		vec3.set(this.scale, 1, 1, 1);
		
		this.rotationAngleX = 0;
		this.rotationAxisX = vec3.create();
		vec3.set(this.rotationAxisX, 1, 0, 0);

		this.rotationAngleY = 0;
		this.rotationAxisY = vec3.create();
		vec3.set(this.rotationAxisY, 0, 1, 0);

		this.rotationAngleZ = 0;
		this.rotationAxisZ = vec3.create();
		vec3.set(this.rotationAxisZ, 0, 0, 1);

		this.modelTransformMatrix = mat4.create();
		mat4.identity(this.modelTransformMatrix);

		this.updateModelTransformMatrix();
	}

	updateModelTransformMatrix(){
		mat4.identity(this.modelTransformMatrix);

		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translateX);
		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translateY);
		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translateZ);

		mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngleX, this.rotationAxisX);
		mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngleY, this.rotationAxisY);
		mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngleZ, this.rotationAxisZ);

		mat4.scale(this.modelTransformMatrix, this.modelTransformMatrix, this.scale);
	}	

    getTranslateX(){
		return this.translateX;
	}
    getTranslateY(){
		return this.translateY;
	}
    getTranslateZ(){
		return this.translateZ;
	}

    getRotationAngleX(){
		return this.rotationAngleX;
	}
    getRotationAngleY(){
		return this.rotationAngleY;
	}
	getRotationAngleZ(){
		return this.rotationAngleZ;
	}

    getScale(){
		return this.scale;
	}

	setTranslateX(newTranslateX){
		this.translateX = newTranslateX;
	}
	setTranslateY(newTranslateY){
		this.translateY = newTranslateY;
	}
	setTranslateZ(newTranslateZ){
		this.translateZ = newTranslateZ;
	}

	moveX(dx=0.1){
		this.translateX[0] += dx;
	}
	moveY(dy=0.1){
		this.translateY[1] += dy;
	}
	moveZ(dz=0.1){
		this.translateZ[2] += dz;
	}

	setRotationAngleX(newRotationAngleX){
		this.rotationAngleX = newRotationAngleX;
	}
    setRotationAngleY(newRotationAngleY){
		this.rotationAngleY = newRotationAngleY;
	}
    setRotationAngleZ(newRotationAngleZ){
		this.rotationAngleZ = newRotationAngleZ;
	}

	rotateX(dthetax=0.1){
		this.rotationAngleX += dthetax;
	}
	rotateY(dthetay=0.1){
		this.rotationAngleY += dthetay;
	}
	rotateZ(dthetaz=0.1){
		this.rotationAngleZ += dthetaz;
	}

    setScale(newScale) {
		this.scale = newScale;
	}

	scalePos(ds=0.1){
		this.scale[0] += ds;
		this.scale[1] += ds;
		this.scale[2] += ds;
	}

	scaleNeg(ds=0.1){
		this.scale[0] -= ds;
		this.scale[1] -= ds;
		this.scale[2] -= ds;
	}
}

export{
	Transform,
}