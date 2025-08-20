precision mediump float;

varying vec3 vPos;
varying float vTime;

void main(void) {
    vec3 uv = vPos * 0.5 + 0.5;
    vec3 origin = vec3(
        vPos.x + 0.1 * sin(vPos.x * 10.0 + vTime * 3.0), 
        vPos.y + 0.1 * cos(vPos.y * 10.0 + vTime * 3.0), 
        0.0);
    float dist = abs(distance(origin, vPos));
    float pulse = 3.0;
    // dist = dist * 0.5 + 0.5;
    vec3 wavy = tan(vec3(uv.x, uv.y, uv.x) * 10.0 + vec3(vTime * 3.0));
    if (dist > pulse + 1.0) {
        gl_FragColor = vec4(1.0, 1.0, 1.0 , 1.0);
    
    } else {
        gl_FragColor = vec4(uv.xy, 0.0 , 1.0);

    }
}   