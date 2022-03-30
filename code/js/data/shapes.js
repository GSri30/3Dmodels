import { Scene } from '../utils/scene-utils.js';
import { getObj } from '../utils/obj-utils.js';
import { Shape } from '../models/shape.js';

const initShapes = async() => {
    let scene = new Scene();

    let arrow_x = await getObj("arrow.obj");
    let arrow_y = await getObj("arrow.obj");
    let arrow_z = await getObj("arrow.obj");
    let object1 = await getObj("Object1.obj");
    let object2 = await getObj("Object2.obj");
    
    const arrowX = new Shape(arrow_x,[1,0,0,1],false,"ArrowX");
	scene.add(arrowX);

	const arrowY = new Shape(arrow_y,[0,1,0,1],false,"ArrowY");
	
	let current = arrowY.transform.getRotationAngleZ();
	current += 3.142/2;
	arrowY.transform.setRotationAngleZ(current);
	scene.add(arrowY);

	const arrowZ = new Shape(arrow_z,[0,0,1,1],false,"ArrowZ");
	
	current = arrowZ.transform.getRotationAngleY();
	current -= 3.142/2;
	arrowZ.transform.setRotationAngleY(current);
	scene.add(arrowZ);

	const monkeyWithCap = new Shape(object1,[0.2,0.4,0.3,1],true,"Monkey With a cap");
	
	current = monkeyWithCap.transform.getScale().slice();
	current[0] -= 0.75;
	current[1] -= 0.75;
	current[2] -= 0.75;
	monkeyWithCap.transform.setScale(current);

	current = monkeyWithCap.transform.getTranslateX();
	current[0] -= 1;
	monkeyWithCap.transform.setTranslateX(current);
	
	scene.add(monkeyWithCap);

	const ballWithRing = new Shape(object2,[0.5,0.5,1,1],true,"Ball With Ring");
	
	current = ballWithRing.transform.getTranslateX();
	current[0] += 1;
	ballWithRing.transform.setTranslateX(current);
	
	scene.add(ballWithRing);

    return scene;
}

export{
    initShapes,
}