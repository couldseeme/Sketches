// noise.frag
#extension GL_EXT_draw_buffers : require 
#define SHADER_NAME NOISE_FRAG

precision mediump float;
uniform float uTime;
uniform float uSeed;
uniform float uNoiseScale;
varying vec2 vTextureCoord;


vec4 permute(vec4 x) {  return mod(((x*34.0)+1.0)*x, 289.0);    }
vec4 taylorInvSqrt(vec4 r) {    return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;
    
    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    
    float n_ = 1.0/7.0;
    vec3  ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

float snoise(float x, float y, float z){
    return snoise(vec3(x, y, z));
}


float getNoise(vec2 uv) {
    return snoise(uv.x * uNoiseScale, uv.y * uNoiseScale + uTime, uSeed);
}

float getNoise(vec2 uv, vec2 offset) {
    return getNoise(uv + offset);
}


void main(void) {
    const vec2 size     = vec2(2.0, 0.0);
    const vec3 off      = vec3(-1.0, 0, 1.0);
    float s11           = getNoise(vTextureCoord);
    float s01           = getNoise(vTextureCoord, off.xy);
    float s21           = getNoise(vTextureCoord, off.zy);
    float s10           = getNoise(vTextureCoord, off.yx);
    float s12           = getNoise(vTextureCoord, off.yz);

    // vec3 va             = normalize(vec3(size.xy, s21 - s01));
    // vec3 vb             = normalize(vec3(size.yx, s12 - s10));
    vec3 va             = normalize(vec3(size.x, s21-s01, size.y)); 
    vec3 vb             = normalize(vec3(size.y, s12-s10, -size.x));
    vec4 bump           = vec4( cross(va,vb) * .5 + .5, 1.0 );

    float noise         = s11;

    gl_FragData[0]      = vec4(noise, noise, noise, 1.0);
    gl_FragData[1]      = bump;
    gl_FragData[2]      = vec4(1.0, 1.0, 0.0, 1.0);
    gl_FragData[3]      = vec4(1.0, 0.0, 1.0, 1.0);
}