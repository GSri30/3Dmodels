import { Scene } from '../utils/scene-utils.js';
import { getObj } from '../utils/obj-utils.js';
import { Shape } from '../models/shape.js';

const initShapes = async() => {
    let scene = new Scene();

    let arrow_x = await getObj("arrow.obj");
    let arrow_y = await getObj("arrow.obj");
    let arrow_z = await getObj("arrow.obj");
    let object1 = await getObj("cone_intersection_cube.obj");
    let object2 = await getObj("cube.obj");
    
    const arrowX = new Shape(arrow_x,[1,0,0,1],false);
	scene.add(arrowX);

	const arrowY = new Shape(arrow_y,[0,1,0,1],false);
	arrowY.transform.rotateZ(Math.PI/2);
	scene.add(arrowY);

	const arrowZ = new Shape(arrow_z,[0,0,1,1],false);
	arrowZ.transform.rotateY(-Math.PI/2);
	scene.add(arrowZ);

	const cone_cube_inter = new Shape(object1,[0.2,0.4,0.3,1],true);
	cone_cube_inter.transform.scaleNeg(0.75);
	scene.add(cone_cube_inter);

	const cube = new Shape(object2,[0.5,0.5,1,1],true);
	cube.transform.scaleNeg(0.8);
	scene.add(cube);

    return scene;
}

export{
    initShapes,
}