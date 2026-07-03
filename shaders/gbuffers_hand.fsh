#version 330 compatibility

uniform sampler2D lightmap;
uniform sampler2D gtexture;
uniform float alphaTestRef = 0.1;

in vec2 lmcoord;
in vec2 texcoord;
in vec4 glcolor;

layout(location = 0) out vec4 color;

void main()
{
    vec4 texColor = texture(gtexture, texcoord);
    
    if (texColor.a < alphaTestRef)
        discard;
    
    vec3 base = texColor.rgb * glcolor.rgb;
    base *= texture(lightmap, lmcoord).rgb;
    base = pow(base * 1.08, vec3(0.95));
    
    color = vec4(base, texColor.a);
}
