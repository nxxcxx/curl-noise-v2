
uniform vec2 resolution;
uniform sampler2D mirrorBuffer;
uniform float pass;
uniform float stage;
// uniform vec3 lookAt;
uniform vec3 halfAngle;
uniform float sortOrder;

bool selectTex( vec2 uv, vec2 tx ) {

	bool res = false;
	float e = 1.0 / resolution.x;

	if ( abs( uv.x - tx.x ) < e &&
		  abs( uv.y - tx.y ) < e
	) {
		res = true;
	}

	return res;
}

void main() {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	vec4 self = texture2D( mirrorBuffer, uv ).rgba;
	float i = floor (uv.x * resolution.x ) + floor( uv.y * resolution.y ) * resolution.x;
	float j = floor( mod( i, 2.0 * stage ) );
	float compare = 0.0;

	if ( ( j < mod( pass, stage ) ) || ( j > ( 2.0 * stage - mod( pass, stage ) - 1.0 ) ) ) {
	   compare = 0.0;
	} else {
	   if ( mod( ( j + mod( pass, stage ) ) / pass, 2.0 ) < 1.0 ) {
	       compare = 1.0;
	   } else {
	       compare = -1.0;
	   }
	}
	float adr = i + compare * pass;
	vec4 partner = texture2D( mirrorBuffer, vec2( floor( mod( adr, resolution.x ) ) / resolution.x, floor( adr / resolution.x ) / resolution.y ) ).rgba;

	float selfProjectedLen = dot( self.xyz, halfAngle );
	float partProjectedLen = dot( partner.xyz, halfAngle );

	vec4 color = ( selfProjectedLen * compare < partProjectedLen * compare ) ? self : partner;

	gl_FragColor = color;

}
