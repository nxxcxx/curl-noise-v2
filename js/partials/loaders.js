'use strict';
var loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => {

	main();
	run();

};

loadingManager.onProgress = ( item, loaded, total ) => {

	console.log( loaded + '/' + total, item );

};

var SHADERS = {};
var shaderLoader = new THREE.XHRLoader( loadingManager );
shaderLoader.setResponseType( 'text' );
shaderLoader.showStatus = true;

shaderLoader.loadShaders = ( SHADERS, urlObj ) => {

	Object.keys( urlObj ).forEach( ( key ) => {

		shaderLoader.load( urlObj[ key ], ( shader ) => {

			SHADERS[ key ] = shader;

		} );

	} );

};

shaderLoader.loadShaders( SHADERS, {

	passVert: 'shaders/pass.vert',
	passFrag: 'shaders/pass.frag',

	hudVert: 'shaders/hud.vert',
	hudFrag: 'shaders/hud.frag',

	particleVert: 'shaders/particle.vert',
	particleFrag: 'shaders/particle.frag',

	velocity: 'shaders/velocity.frag',
	position: 'shaders/position.frag',

	sort: 'shaders/mergeSort.frag',

	opacityMapVert: 'shaders/opacityMap.vert',
	opacityMapFrag: 'shaders/opacityMap.frag',


} );

var TEXTURES = {};
var textureLoader = new THREE.TextureLoader( loadingManager );
textureLoader.load( 'sprites/electricScaled.png', ( tex ) => {
	TEXTURES.electric = tex;
} );
