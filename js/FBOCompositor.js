'use strict';

function FBOCompositor( renderer, bufferSize, passThruVertexShader ) {

	this.renderer = renderer;

	this._getWebGLExtensions();
	this.bufferSize = bufferSize;
	this.passThruVertexShader = passThruVertexShader;
	var halfBufferSize = bufferSize * 0.5;
	this.camera = new THREE.OrthographicCamera( -halfBufferSize, halfBufferSize, halfBufferSize, -halfBufferSize, 1, 10 );
	this.camera.position.z = 5;
	this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
	this.scene = new THREE.Scene();
	this.scene.add( this.quad );
	this.dummyRenderTarget = new THREE.WebGLRenderTarget( 2, 2 );

	this.passThruShader = new THREE.ShaderMaterial( {

		uniforms: {
			resolution: {
				type: 'v2',
				value: new THREE.Vector2( this.bufferSize, this.bufferSize )
			},
			passTexture: {
				type: 't',
				value: null
			}
		},
		vertexShader: SHADERS.passVert,
		fragmentShader: SHADERS.passFrag,
		blending: THREE.NoBlending

	} );

	this.passes = [];

	// sorting
	this.totalSortStep = ( Math.log2( this.bufferSize*this.bufferSize ) * ( Math.log2( this.bufferSize * this.bufferSize ) + 1 ) ) / 2;
	console.log( this.totalSortStep );
	this.sortPass = -1;
	this.sortStage = -1;

}

FBOCompositor.prototype = {

	_getWebGLExtensions: function () {

		var gl = this.renderer.getContext();
		if ( !gl.getExtension( "OES_texture_float" ) ) {
			console.error( "No support for float textures!" );
		}

		if ( gl.getParameter( gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS ) === 0 ) {
			console.error( "No support for vertex shader textures!" );
		}

	},

	getPass: function ( name ) {
		/* todo: update to ECMA6 Array.find() */
		var pass = null;
		this.passes.some( function ( currPass ) {

			var test = currPass.name === name;
			if ( test ) pass = currPass;
			return test;

		} );

		return pass;

	},

	addPass: function ( name, fragmentShader, inputTargets, uniforms ) {

		var pass = new FBOPass( name, this.passThruVertexShader, fragmentShader, this.bufferSize );
		pass.inputTargetList = inputTargets  || {};
		pass.attachUniform( uniforms || {} );
		this.passes.push( pass );
		return pass;

	},

	updatePassDependencies: function () {

		var self = this;
		this.passes.forEach( function ( currPass ) {

			Object.keys( currPass.inputTargetList ).forEach( function ( shaderInputName ) {

				var targetPass = currPass.inputTargetList[ shaderInputName ];
				currPass.setInputTarget( shaderInputName, self.getPass( targetPass ).getRenderTarget() );

			} );

		} );

	},

	_renderPass: function ( shader, passTarget ) {

		this.quad.material = shader;
		this.renderer.render( this.scene, this.camera, passTarget, true );

	},

	renderInitialBuffer: function ( dataTexture, toPass ) {

		var pass = this.getPass( toPass );
		this.passThruShader.uniforms.passTexture.value = dataTexture;
		this._renderPass( this.passThruShader, pass.doubleBuffer[ 1 ] ); // render to secondary buffer which is already set as input to first buffer.
		this._renderPass( this.passThruShader, pass.doubleBuffer[ 0 ] ); // or just render to both
		/*!
		 *	dont call renderer.clear() before updating the simulation it will clear current active buffer which is the render target that we previously rendered to.
		 *	or just set active target to dummy target.
		 */
		this.renderer.setRenderTarget( this.dummyRenderTarget );

	},

	step: function () {

		for ( let i = 0; i < this.passes.length; i++ ) {

			this.updatePassDependencies();
			var currPass = this.passes[ i ];

			if ( currPass.name === 'sortPass' ) {

				// copy position buffer to sort buffer
				this.renderInitialBuffer( this.getPass( 'positionPass' ).getRenderTarget(), currPass.name );

				for ( let s = 0; s <= this.totalSortStep; s ++ ) {

					this.sortPass --;
			      if ( this.sortPass  < 0 ) {
						this.sortStage ++;
						this.sortPass = this.sortStage;
			      }

					currPass.uniforms.pass.value  = 1 << this.sortPass;
					currPass.uniforms.stage.value = 1 << this.sortStage;

					// console.log( 'Stage:', this.sortStage, 1 << this.sortStage );
					// console.log( 'Pass:', this.sortPass, 1 << this.sortPass );
					// console.log( '------------------------------------------' );

					this._renderPass( currPass.getShader(), currPass.getRenderTarget() );
					currPass.swapBuffer();

				}

				// reset
				this.sortPass = -1;
				this.sortStage = -1;

			} else {

				// other passes
				this._renderPass( currPass.getShader(), currPass.getRenderTarget() );
				currPass.swapBuffer();

			}

		} // end loop

	}

};


function FBOPass( name, vertexShader, fragmentShader, bufferSize ) {

	this.name = name;
	this.vertexShader = vertexShader;
	this.fragmentShader = fragmentShader;
	this.bufferSize = bufferSize;

	this.currentBuffer = 0;
	this.doubleBuffer = []; //  single FBO cannot act as input (texture) and output (render target) at the same time, we take the double-buffer approach
	this.doubleBuffer[ 0 ] = this.generateRenderTarget();
	this.doubleBuffer[ 1 ] = this.generateRenderTarget();

	this.inputTargetList = {};

	this.uniforms = {
		resolution: {
			type: 'v2',
			value: new THREE.Vector2( this.bufferSize, this.bufferSize )
		},
		mirrorBuffer: {
			type: 't',
			value: this.doubleBuffer[ 1 ]
		}
	};

	this.shader = new THREE.ShaderMaterial( {

		uniforms: this.uniforms,
		vertexShader: this.vertexShader,
		fragmentShader: this.fragmentShader,
		blending: THREE.NoBlending

	} );

}

FBOPass.prototype = {

	getShader: function () {
		return this.shader;
	},
	getRenderTarget: function () {
		return this.doubleBuffer[ this.currentBuffer ];
	},
	setInputTarget: function ( shaderInputName, inputTarget ) {
		this.uniforms[ shaderInputName ] = {
			type: 't',
			value: inputTarget
		};
	},
	swapBuffer: function () {

		this.uniforms.mirrorBuffer.value = this.doubleBuffer[ this.currentBuffer ];
		this.currentBuffer ^= 1;

	},
	generateRenderTarget: function () {

		var target = new THREE.WebGLRenderTarget( this.bufferSize, this.bufferSize, {

			wrapS: THREE.ClampToEdgeWrapping,
			wrapT: THREE.ClampToEdgeWrapping,
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat,
			type: THREE.FloatType,
			stencilBuffer: false,
			depthBuffer: false,

		} );

		return target;

	},
	attachUniform: function ( uniformsInput ) {

		var self = this;
		Object.keys( uniformsInput ).forEach( function ( key ) {

			self.uniforms[ key ] = uniformsInput[ key ];

		} );

	},

};
