
uniform sampler2D particleTexture;
uniform float sortOrder;

varying vec3 vVel;
varying float vLife;
varying float vDepth;
varying float vOpacity;

varying vec2 blurDirection;

float square(float s) { return s * s; }
vec3 square(vec3 s) { return s * s; }
vec3 hueGradient(float t) {
    vec3 p = abs(fract(t + vec3(1.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0);
	return (clamp(p - 1.0, 0.0, 1.0));
}
vec3 electricGradient(float t) {
	return clamp( vec3(t * 8.0 - 6.3, square(smoothstep(0.6, 0.9, t)), pow(abs(t), 3.0) * 1.7), 0.0, 1.0);
}
vec3 heatmapGradient(float t) {
	return clamp((pow(abs(t), 1.5) * 0.8 + 0.2) * vec3(smoothstep(0.0, 0.35, t) + t * 0.5, smoothstep(0.5, 1.0, t), max(1.0 - t * 1.7, t * 7.0 - 6.0)), 0.0, 1.0);
}
vec3 neonGradient(float t) {
	return clamp(vec3(t * 1.3 + 0.1, square(abs(0.43 - t) * 1.7), (1.0 - t) * 1.7), 0.0, 1.0);
}
vec3 rainbowGradient(float t) {
	vec3 c = 1.0 - pow(abs(vec3(t) - vec3(0.65, 0.5, 0.2)) * vec3(3.0, 3.0, 5.0), vec3(1.5, 1.3, 1.7));
	c.r = max((0.15 - square(abs(t - 0.04) * 5.0)), c.r);
	c.g = (t < 0.5) ? smoothstep(0.04, 0.45, t) : c.g;
	return clamp(c, 0.0, 1.0);
}
vec3 ansiGradient(float t) {
	return mod(floor(t * vec3(8.0, 4.0, 2.0)), 2.0);
}

float easeOutQuint( float t ) {
	return (t=t-1.0)*t*t*t*t + 1.0;
}
float easeOutQuad( float t ) {
	return -t*(t-2.0);
}
float easeOutCirc( float t ) {
	return sqrt( 1.0 - (t-1.0)*(t-1.0) );
}

// vec3 luminanceCoef = vec3( 0.299, 0.587, 0.114 );
// float textureLuminance = clamp( dot( color.rgb, luminanceCoef ), 0.0, 1.0 );
// color.rgb = heatmapGradient( easeOutQuint( nVel ) ) * luminance;

void main() {

	float particleAlpha = 0.25;

	float distanceFromCenter = distance( gl_PointCoord.xy, vec2( 0.5, 0.5 ) );
	if ( distanceFromCenter > 0.5 ) discard;
	float alpha = clamp( 1.0 - distanceFromCenter * 2.0, 0.0, 1.0 ) * particleAlpha;

   // float alpha = texture2D( particleTexture, gl_PointCoord.xy ).a;

   // blur along direction of velocity
      // float blurScale = 0.08;
      // const int nSamples = 32;
      // float alpha = texture2D( particleTexture, gl_PointCoord.xy ).a;
      // for (int i = 1; i < nSamples; ++i) {
      //    vec2 offset = blurDirection * blurScale * (float(i) / float(nSamples - 1) - 0.5);
      //    alpha += texture2D( particleTexture, gl_PointCoord.xy + offset).a;
      // }
      // alpha /= float( nSamples );
      // alpha *= particleAlpha;
   //


	// vec3 particleColor = vec3( 1.0, 0.2, 0.3 );
	vec3 particleColor = heatmapGradient( smoothstep( -0.1, 1.3, vLife ) ) * 1.7;

	// current slice accumulated shadow intensity
	float accLightScale = 0.8;
	float accumulatedShadow  = 1.0 - ( vOpacity * accLightScale );

	vec3 color =  accumulatedShadow * particleColor;

	// if ( vLife < 50.0 ) {
	// 	color = accumulatedShadow * vec3( 0.1, 0.1, 1.0 );
	// 	alpha = 0.5;
	// }



	gl_FragColor = vec4( color * alpha, alpha );



}
