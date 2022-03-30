import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader';

const getObj = async(name) => {
	let data = await (await fetch(`/js/data/objects/${name}`)).text();
	return await (new objLoader.Mesh(data));
}

export{
    getObj,
}