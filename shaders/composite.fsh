#version 330 compatibility

uniform sampler2D colortex0;

in vec2 texcoord;

layout(location = 0) out vec4 color;

void main()
{
    vec3 sceneColor = texture(colortex0, texcoord).rgb;
    sceneColor = pow(sceneColor, vec3(1.0 / 2.2));
    color = vec4(sceneColor, 1.0);
}
