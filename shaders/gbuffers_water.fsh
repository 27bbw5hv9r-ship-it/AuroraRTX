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
    
    vec3 waterBase = vec3(0.04, 0.22, 0.48);
    vec3 waterTex = mix(texColor.rgb * glcolor.rgb * 0.35, waterBase, 0.88);
    
    vec3 lightmapColor = texture(lightmap, lmcoord).rgb;
    waterTex *= lightmapColor;
    
    color = vec4(waterTex, texColor.a);
}
