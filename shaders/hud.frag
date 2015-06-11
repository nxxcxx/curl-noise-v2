uniform sampler2D tDiffuse;
varying vec2 vUv;

void main() {

	vec4 tCol = texture2D( tDiffuse, vUv ).rgba;

	vec3 col = 1.0 - vec3( 1.0 ) * tCol.a;

	gl_FragColor = vec4( col, 1.0 );

}
