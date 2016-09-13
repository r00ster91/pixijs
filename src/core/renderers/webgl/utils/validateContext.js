function validateContext(gl)
{
	let attributes = gl.getContextAttributes();

	// this is going to be fairly simple for now.. but at least we have rom to grow!
	if(!attributes.stencil)
	{
		console.warn('Provided WebGL context does not have a stencil buffer, masks may not render correctly'); // jshint ignore:line
	}
}

export default validateContext;