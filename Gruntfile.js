module.exports = function ( grunt ) {

	// Project configuration.
	grunt.initConfig( {

		pkg: grunt.file.readJSON( 'package.json' ),

		browserify: {
			main: {
				files: {
					'js/build/deploy.js': [ 'js/build/app.js' ]
				}
			}
		},
		concat: {
			options: {},
			main: {
				src: [ 'js/loaders.js', 'js/scene.js', 'js/gui.js', 'js/FBOCompositor.js', 'js/hud.js', 'js/particle.js', 'js/main.js', 'js/run.js', 'js/events.js' ],
				dest: 'js/build/app.js',
				nonull: true,
				options: {
					banner: "'use strict';\n",
					process: function ( src, filepath ) {
						return '// Source: ' + filepath + '\n' + src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
					},
					sourceMap: true
				}
			},
			vendor: {
				src: [ 'js/vendor/ndarray.js', 'js/vendor/Detector.js', 'js/vendor/dat.gui.min.js', 'js/vendor/stats.min.js', 'js/vendor/three.js', 'js/vendor/OrbitControls.js', 'js/vendor/OBJLoader.js' ],
				dest: 'js/vendor/vendor-merge.min.js',
				nonull: true,
				options: {
					separator: ';'
				}
			}
		},
		uglify: {
			options: {},
			// main: {
			// 	src: [ 'js/build/app.js' ],
			// 	dest: 'js/build/app.min.js',
			// 	sourceMap: true
			// },
			vendor: {
				src: [ 'js/vendor/vendor-merge.min.js' ],
				dest: 'js/vendor/vendor-merge.min.js',
				sourceMap: false
			}
		},
		watch: {
			options: {
				livereload: true
			},
			grunt: {
				files: [ 'Gruntfile.js' ],
				tasks: [ 'concat:main', 'preprocess' ]
			},
			def: {
				files: [ '*.html', 'shaders/*' ]
			},
			js: {
				files: [ 'js/*.js' ],
				tasks: [ 'concat:main', 'preprocess' ]
			}
		},
		connect: {
			server: {
				options: {
					port: 6969,
					base: '.',
				}
			}
		},
		preprocess: {
			options: {
				context: {
					DEBUG: true
				}
			},
			js: {
				options: {
					inline: true
				},
				src: 'js/build/app.js',
			}
		}

	} );

	// Load the plugin that provides the tasks.
	// grunt.loadNpmTasks( 'grunt-browserify' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-connect' );
	grunt.loadNpmTasks( 'grunt-preprocess' );

	// tasks
	grunt.registerTask( 'default', [ 'watch' ] );
	grunt.registerTask( 'serve', [ 'connect:server', 'watch' ] );
	grunt.registerTask( 'build', [ 'concat', 'preprocess', 'uglify' ] );

};
