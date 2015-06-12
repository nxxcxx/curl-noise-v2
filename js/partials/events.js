'use strict';

window.addEventListener( 'keypress', ( event ) => {

	var key = event.keyCode;

	switch( key ) {

		case 32: SCENE_SETTINGS.pause = !SCENE_SETTINGS.pause;
		break;

		case 65:/*A*/
		case 97:/*a*/ SCENE_SETTINGS.enableGridHelper = !SCENE_SETTINGS.enableGridHelper; updateHelpers();
		break;

		case 83 :/*S*/
		case 115:/*s*/ SCENE_SETTINGS.enableAxisHelper = !SCENE_SETTINGS.enableAxisHelper; updateHelpers();
		break;

	}

} );


window.addEventListener( 'resize', debounce( onWindowResize, 200 ) );

function onWindowResize() {

	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;

	PIXEL_RATIO = window.devicePIXEL_RATIO || 1;
	SCREEN_RATIO = WIDTH / HEIGHT;

	CAMERA.aspect = SCREEN_RATIO;
	CAMERA.updateProjectionMatrix();

	RENDERER.setSize( WIDTH, HEIGHT );
	RENDERER.setPixelRatio( PIXEL_RATIO );

	$$.hud.update();

}
