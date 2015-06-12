'use strict';

var gui, gui_display, gui_settings;

function initGui() {

	// gui_settings.add( Object, property, min, max, step ).name( 'name' );

	gui = new dat.GUI();
	gui.width = 300;

	gui_display = gui.addFolder( 'Display' );
		gui_display.autoListen = false;

	gui_settings = gui.addFolder( 'Settings' );

		gui_settings.addColor( SCENE_SETTINGS, 'bgColor' ).name( 'Background' );
		gui_settings.add( CAMERA, 'fov', 25, 120, 1 ).name( 'FOV' );

		gui_settings.add( $$.uniformsInput.timeMult, 'value', 0.0, 0.5  , 0.01 ).name( 'Time Multiplier' );
		gui_settings.add( $$.uniformsInput.noiseFreq, 'value', 0.0, 3.0  , 0.01 ).name( 'Frequency' );
		gui_settings.add( $$.uniformsInput.speed, 'value', 0.0, 200.0, 0.01 ).name( 'Speed' );
		gui_settings.add( $$.psys.material.uniforms.size, 'value', 1.0, 20.0 , 0.01 ).name( 'Size' );
		gui_settings.add( SCENE_SETTINGS, 'showFrameBuffer' ).name( 'Show Frame Buffer' );


	gui_display.open();
	gui_settings.open();

	gui_settings.__controllers.forEach( ( controller ) => {
		controller.onChange( updateSettings );
	} );

}

function updateSettings() {

	CAMERA.updateProjectionMatrix();
	$$.bgMat.color.setHex( SCENE_SETTINGS.bgColor );
	// renderer.setClearColor( SCENE_SETTINGS.bgColor , 1.0 );

}

function updateGuiDisplay() {

	gui_display.__controllers.forEach( ( controller ) => {
		controller.updateDisplay();
	} );

}
