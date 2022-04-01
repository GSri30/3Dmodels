class Scene{
	constructor(){
		this.primitives = []
	}

	add(primitive){
		if( this.primitives && primitive )
		{
			this.primitives.push(primitive)
		}
	}

	nearestSHAPE(data){
		let min = 10000;
		data = new Float32Array(data);
		
		for(let i=0;i<data.length;i++) data[i] = data[i]/255.0;

		let diffCanvas = data[0] - 0.9 + data[1] - 0.9 + data[2] - 0.9 + data[3] - 1;
		if(diffCanvas < 0.002 && diffCanvas >-0.002)
			return;

		let selectedShape;
		this.primitives.forEach((primitive) => {
			if(!primitive.isSelectable)
				return;
			let euclidean_dist = this.colorEuclidean(primitive,data);
			if(euclidean_dist >= 0.02)
				return;
			if(euclidean_dist < min){
				min = euclidean_dist;
				selectedShape = primitive;
			}
		});
		return selectedShape;
	}

	colorEuclidean(shape,data){
		let color = shape.color;
		return Math.sqrt(Math.pow((color[0]-data[0]), 2) + Math.pow((color[1]-data[1]), 2) + Math.pow((color[2]-data[2]), 2) + Math.pow((color[3]-data[3]), 2));
	}
}

export{
    Scene,
}