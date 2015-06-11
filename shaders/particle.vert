
uniform float size;
uniform sampler2D positionBuffer;
uniform sampler2D velocityBuffer;
uniform sampler2D opacityMap;

uniform mat4 lightMatrix;

attribute vec3 here;

varying float vLife;
varying float vOpacity;
varying vec2 blurDirection;



float rand( vec2 p ){
    return fract(sin(dot(p.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {

   vLife = texture2D( positionBuffer, here.xy ).a / 150.0;

	vec3 newPosition = texture2D( positionBuffer, here.xy ).rgb;

   // project to lighViewSpaceCoord. lightMatrix contains only [0.5 offsetMatrix] * [projtection] * [view]. so need to multiply w/ modelMatrix
   vec2 opacityTexCoord = vec2( lightMatrix * modelMatrix * vec4( newPosition, 1.0 ) );
   vOpacity = texture2D( opacityMap, opacityTexCoord ).a;

	// gl_PointSize = size;
	gl_PointSize = size * ( 2000.0 / length( ( modelViewMatrix * vec4( newPosition, 1.0 ) ).xyz ) ) ;

   vec4 MVP = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
   vec2 projectedParticleCoord = MVP.xy;

   // !todo: get vel from sorted texture
   vec3 vel = vec3( 5.0, 0.0, 0.0 );
   vec2 projectedVelocityCoord = ( projectionMatrix * modelViewMatrix * vec4( newPosition + vel, 1.0 ) ).xy;

   blurDirection = projectedVelocityCoord - projectedParticleCoord;

	gl_Position = MVP;


}
