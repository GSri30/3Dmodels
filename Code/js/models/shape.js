import { Transform } from '../utils/transform-utils.js';

class Shape{
	constructor(data, color, isSelectable){
		this.isSelectable = isSelectable;
		this.original_color = color;
        this.data = data;
		this.color = color;
		this.vertexArray = new Float32Array(data.vertices);
		this.vertexIndices = new Uint16Array(data.indices);
		this.transform = new Transform();
	}
	
	centroid(){
		let x=0.0, y=0.0, z=0.0, vertices=0, i=0, j=1, k=2;
		
		while(k<this.vertexArray.length){
			x += this.vertexArray[i]+this.transform.getTranslateX()[0];
			y += this.vertexArray[j]+this.transform.getTranslateY()[1];
			z += this.vertexArray[k]+this.transform.getTranslateZ()[2];
			vertices += 1;
			i+=3;
			j+=3;
			k+=3;
		}

		return [x/vertices, y/vertices, z/vertices];
	}
}

export{
    Shape,
}