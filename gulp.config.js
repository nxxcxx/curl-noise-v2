module.exports = {

	partialsSrc: [
		'./js/partials/loaders.js',
		'./js/partials/scene.js',
		'./js/partials/gui.js',
		'./js/partials/FBOCompositor.js',
		'./js/partials/hud.js',
		'./js/partials/particle.js',
		'./js/partials/main.js',
		'./js/partials/run.js',
		'./js/partials/events.js',
		'./js/partials/util.js'
	],
	vendorSrc: [
		'./js/vendor/ndarray.js',
		'./js/vendor/three.min.js',
		'./js/vendor/Detector.js',
		'./js/vendor/OrbitControls.js',
		'./js/vendor/stats.min.js',
		'./js/vendor/dat.gui.min.js'
	],
	watch: [
		'./js/partials/*',
		'./js/vendor/*',
		'./shaders/*',
		'./css/*',
		'index.html'
	],
	babel: true,
	uglify: false,
	jshint: false

};
