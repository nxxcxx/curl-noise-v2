'use strict';

if ( !Detector.webgl ){
	Detector.addGetWebGLMessage();
}

var $$ = {};
var CANVAS, STATS;
var SCENE, CAMERA, CAMERA_CTRL, RENDERER;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var PIXEL_RATIO = window.devicePIXEL_RATIO || 1;
var SCREEN_RATIO = WIDTH / HEIGHT;
var CLOCK = new THREE.Clock();

// ---- Settings
var SCENE_SETTINGS = {

	bgColor: 0x2d2d2d,
	pause: false,
	enableGridHelper: false,
	enableAxisHelper: false,
	showFrameBuffer: true

};

// ---- Scene
	CANVAS = document.getElementById( 'canvas' );
	SCENE = new THREE.Scene();

// ---- Camera
	CAMERA = new THREE.PerspectiveCamera( 70, SCREEN_RATIO, 10, 100000 );
	CAMERA_CTRL = new THREE.OrbitControls( CAMERA, CANVAS );
	CAMERA.position.set( -321.5847028300089, 215.28711637817776, 881.9719256352606 );
	CAMERA.quaternion.set( -0.12170374143462927, -0.340052864691943, 0.04443202001754455, 0.9314386960684689 );
	CAMERA_CTRL.center.set( 243.27711348462407, -17.799729328901254, 211.47633089038425 );
	CAMERA_CTRL.update();

// ---- Renderer
	RENDERER = new THREE.WebGLRenderer( { antialias: false , alpha: true } );
	RENDERER.setSize( WIDTH, HEIGHT );
	RENDERER.setPixelRatio( PIXEL_RATIO );
	RENDERER.setClearColor( SCENE_SETTINGS.bgColor, 1.0 );
	RENDERER.autoClear = false;

	CANVAS.appendChild( RENDERER.domElement );

// ---- Stats
	STATS = new Stats();
	CANVAS.appendChild( STATS.domElement );

// ---- grid & axis helper
	var gridHelper = new THREE.GridHelper( 600, 50 );
	gridHelper.setColors( 0 );
	gridHelper.material.opacity = 0.5;
	gridHelper.material.transparent = true;
	gridHelper.position.y = -300;
	SCENE.add( gridHelper );

	var axisHelper = new THREE.AxisHelper( 1000 );
	SCENE.add( axisHelper );

	function updateHelpers() {
		axisHelper.visible = SCENE_SETTINGS.enableAxisHelper;
		gridHelper.visible = SCENE_SETTINGS.enableGridHelper;
	}
	updateHelpers();
