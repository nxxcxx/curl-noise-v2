// !todo: fix  particle flickering because velocity buffer not sync with sorted position buffer
// !todo: when rotate mesh, sorting axis is wrong
// !todo: fix particle stop sorting when pause and changing camera angle

'use strict';

function update() {

	$$.uniformsInput.time.value = CLOCK.getElapsedTime();

	$$.psys.computeHalfAngle( CAMERA );
	$$.sortUniforms.halfAngle.value = $$.psys.halfAngle;
	$$.FBOC.step();
	$$.psys.setPositionBuffer( $$.FBOC.getPass( 'sortPass' ).getRenderTarget() );

	updateGuiDisplay();

}


// ----  draw loop
function run() {

	requestAnimationFrame( run );

	RENDERER.setClearColor( 0, 0.0 );
	RENDERER.clear();

	if ( !SCENE_SETTINGS.pause ) {
		update();
	}

	RENDERER.render( SCENE, CAMERA );

	$$.psys.render( RENDERER, CAMERA );

	RENDERER.render( $$.bgScene, $$.bgCam );

	if ( SCENE_SETTINGS.showFrameBuffer ) {
		$$.hud.setInputTexture( $$.psys.opacityMap );
		$$.hud.render();
	}

	STATS.update();

}
