#ifndef COMMON_GLSL
#define COMMON_GLSL

uniform mat4 gbufferModelView;
uniform mat4 gbufferModelViewInverse;
uniform mat4 gbufferProjection;
uniform mat4 gbufferProjectionInverse;
uniform mat4 gbufferPreviousModelView;
uniform mat4 gbufferPreviousProjection;

uniform mat4 shadowModelView;
uniform mat4 shadowProjection;
uniform mat4 shadowModelViewInverse;

uniform vec3 cameraPosition;
uniform vec3 previousCameraPosition;
uniform float viewWidth;
uniform float viewHeight;
uniform float near;
uniform float far;

uniform float frameTime;
uniform int frameCounter;
uniform float gameTime;

uniform sampler2D colortex0;
uniform sampler2D colortex1;
uniform sampler2D depthtex0;
uniform sampler2D shadowtex0;
uniform sampler2D shadowtex1;

vec2 screenToNDC(vec2 screen)
{
    return screen * 2.0 - 1.0;
}

vec2 ndcToScreen(vec2 ndc)
{
    return ndc * 0.5 + 0.5;
}

float linearizeDepth(float depth)
{
    return (2.0 * near * far) / (far + near - depth * (far - near));
}

vec3 safeDivide(vec3 a, float b)
{
    return a / max(b, 0.001);
}

#endif
