const vertexShader = `      
attribute vec4 a_position;

uniform mat4 model_matrix;
uniform mat4 view_matrix;
uniform mat4 proj_matrix;

void main(){             
	gl_Position = proj_matrix * view_matrix * model_matrix * a_position;
}                          
`;

export default vertexShader;