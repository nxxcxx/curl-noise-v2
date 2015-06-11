
uniform vec2 resolution;
uniform sampler2D passTexture;

void main()	{

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	vec4 color = texture2D( passTexture, uv ).rgba;

	gl_FragColor = color;

}
