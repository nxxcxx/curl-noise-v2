'use strict';

function main() {

	initParticleSystem();

	$$.hud = new HUD( RENDERER );

	initBackground();

	initGui();

}


function initParticleSystem() {

	$$.uniformsInput = {
		time     : { type: 'f', value: 0.0 },
		timeMult : { type: 'f', value: 0.27 },
		noiseFreq: { type: 'f', value: 1.4 },
		speed    : { type: 'f', value: 45.0 }
	};

	$$.sortUniforms = {
		pass: { type: 'f', value: -1 },
		stage: { type: 'f', value: -1 },
		lookAt: { type: 'v3', value: new THREE.Vector3( 0, 0, -1 ) },
		halfAngle: { type: 'v3', value: new THREE.Vector3() },
		sortOrder: { type: 'f', value: 1 }
	};


	var numParSq = 256;
	$$.FBOC = new FBOCompositor( RENDERER, numParSq, SHADERS.passVert );
	$$.FBOC.addPass( 'velocityPass', SHADERS.velocity, { positionBuffer: 'positionPass' }, $$.uniformsInput );
	$$.FBOC.addPass( 'positionPass', SHADERS.position, { velocityBuffer: 'velocityPass' }, $$.uniformsInput );
	$$.FBOC.addPass( 'sortPass', SHADERS.sort, {}, $$.sortUniforms );

	$$.psys = new ParticleSystem( numParSq );
	$$.psys.init();

	var initialPositionDataTexture = $$.psys.generatePositionTexture();
	$$.FBOC.renderInitialBuffer( initialPositionDataTexture, 'positionPass' );

}

function initBackground() {

	$$.bgGeo = new THREE.PlaneBufferGeometry( 2, 2 );
	$$.bgMat = new THREE.MeshBasicMaterial( {

		color: SCENE_SETTINGS.bgColor,
		side: THREE.DoubleSide,
		transparent: true,

		blending: THREE.CustomBlending,
		blendEquation: THREE.AddEquation,
		blendSrc: THREE.OneMinusDstAlphaFactor,
		blendDst: THREE.OneFactor

	} );
	$$.bgMesh = new THREE.Mesh( $$.bgGeo, $$.bgMat );
	$$.bgScene = new THREE.Scene();
	$$.bgCam = new THREE.Camera();
	$$.bgScene.add( $$.bgMesh );

}
