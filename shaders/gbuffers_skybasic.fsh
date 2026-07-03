#version 330 compatibility

uniform int renderStage;

in vec4 glcolor;

layout(location = 0) out vec4 color;

void main()
{
    color = glcolor;
}
