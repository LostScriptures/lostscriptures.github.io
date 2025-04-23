attribute vec3 positionAttr;

varying vec3 vPos;
varying float vTime;
uniform float uTime;

void main(void) {
    vec3 pos = positionAttr;
    //pos.x += 0.1 * sin(pos.x * 10.0 + uTime * 3.0); // subtle vertical wave
    //pos.y += 0.1 * cos(pos.y * 10.0 + uTime * 3.0); // subtle horizontal wave

    gl_Position = vec4(pos, 1.0);

    vPos = positionAttr;
    vTime = uTime;
}