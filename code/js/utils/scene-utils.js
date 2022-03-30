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

	computeExtremes(){
		let minx=1, maxx=-1, miny=1, maxy=-1, minz=1, maxz=-1;

		this.primitives.forEach((primitive) => {
			let centroid = primitive.centroid();
			centroid[0] += primitive.transform.translate[0];
			centroid[1] += primitive.transform.translate[1];
			centroid[2] += primitive.transform.translate[2];
			
			if(centroid[0] > maxx)
				maxx = centroid[0];
			if(centroid[0] < minx)
				minx = centroid[0];
			
			if(centroid[1] > maxy)
				maxy = centroid[1];
			if(centroid[1] < miny)
				miny = centroid[1];				
			
			if(centroid[2] > maxz)
				maxz = centroid[2];
			if(centroid[2] < minz)
				minz = centroid[2];
		});
		
		return [minx, maxx, miny, maxy, minz, maxz];
	}

	getxmin(){
		return this.computeExtremes()[0];
	}
	getxmax(){
		return this.computeExtremes()[1];
	}
	getymin(){
		return this.computeExtremes()[2];
	}
	getymax(){
		return this.computeExtremes()[3];
	}
	getminz(){
		return this.computeExtremes()[4];
	}
	getmaxz(){
		return this.computeExtremes()[5];
	}

	centroid(){
		return newFloat32Array([(this.getxmin() + this.getxmax())/2, (this.getymin() + this.getymax())/2, (this.getzmin() + this.getzmax())/2]);
	}
}

export{
    Scene,
}