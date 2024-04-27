import * as THREE from 'three'
import { useEffect, useRef, useState, forwardRef, useCallback, Suspense, memo } from 'react'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, Environment, Html, useTexture, useScroll, ScrollControls, Scroll, SpotLight, useDepthBuffer, shaderMaterial } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing } from 'maath'
import { cubic } from 'maath/easing'
import getUuid from 'uuid-by-string'
import tunnel from 'tunnel-rat'
import useSound from 'use-sound';

import { lerp } from './utils.js'
import { EffectComposer, GodRays, Bloom } from '@react-three/postprocessing'
import { log } from 'three/examples/jsm/nodes/Nodes.js'

const GOLDENRATIO = 1.61803398875
const ui = tunnel()


export const App = ({ vitraux }) => {
  return (
    <>
      <div id='dom-portal'>
        <ui.Out />
        <Loader />
      </div>

      <Canvas shadows dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
        {/* <ambientLight intensity={0.015} /> */}
        <color attach="background" args={['#191920']} />
        <fog attach="fog" args={['#191920', 0, 15 * 2]} />
        <group position={[0, -0.5, 0]}>
          <ScrollControls pages={1.45} damping={0.1}>
            <ScrollWrapper vitraux={vitraux} />
          </ScrollControls>
          {/* <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={80}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.5}
        />
      </mesh> */}
        </group>
        <Environment preset="city" />
        <mesh receiveShadow position={[0, -10, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[50, 50]} />
          <meshPhongMaterial />
        </mesh>
      </Canvas>
    </>
  )
}

function Loader() {
  const loaderRef = useRef()
  const removeCurtain = () => {
    loaderRef.current.classList.add('disappear')
  }
  return (
    <div className='loader-wrapper' ref={loaderRef}>
      <button className='loader-button' onClick={removeCurtain}>Start</button>
    </div>
  )
}
function ScrollWrapper({ vitraux }) {
  return (
    <>
      <Frames vitraux={vitraux} />
    </>
  )
}

function Frames({ vitraux, q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
  const ref = useRef([])
  const clicked = useRef()
  const god = useRef()
  const [hovered, setHovered] = useState(0)
  const itemsRef = useRef([]);
  const [, params] = useRoute('/item/:id')
  const [, setLocation] = useLocation()
  const data = useScroll()
  let active = false;
  const [expo, setExpo] = useState(0);
  useEffect(() => {
    console.log('useEffect')
    const a = data.range(0, 1)
    clicked.current = ref.current.getObjectByName(params?.id)
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true)
      clicked.current.parent.localToWorld(p.set(1.5, 5, 3.25))
      clicked.current.parent.getWorldQuaternion(q)
      active = true;
    } else {
      p.set(0, 0, 5.5)
      q.identity()
      active = false;
    }
  })

  const change = (hover, index) => {
    setHovered(index);
  }

  const handleGodrays = useCallback(change, [setHovered])
  useFrame((state, dt) => {
    if (!active && data) data.el.scrollTop = lerp(data.el.scrollTop, 0, 0.1)

    if (god.current && god.current.blendMode) {
      god.current.blendMode.opacity.value = lerp(god.current.blendMode.opacity.value, Math.abs(Math.sin(state.clock.elapsedTime)), cubic.inOut(0.7))
      console.log(god.current.blendMode.opacity.value)
      // if (hovered) easing.damp(god.current.blendMode.opacity, 'value', 1, cubic.inOut(0.6), dt)
      // else easing.damp(god.current.blendMode.opacity, 'value', 0, cubic.inOut(0.6), dt)
    }
    // Try to change exposure
    // if (hovered != 1) exposure = lerp(exposure, 0.2, 0.1)
    // else exposure = lerp(exposure, 0, 0.1)
    easing.damp3(state.camera.position, p, cubic.inOut(0.6), dt)
    easing.dampQ(state.camera.quaternion, q, cubic.inOut(0.6), dt)
  })
  return (
    <>
      <group
        ref={ref}
        onClick={(e) => (e.stopPropagation(), setLocation(clicked.current === e.object ? '/' : '/item/' + e.object.name))}
        onPointerMissed={() => setLocation('/')}>
        {vitraux.map((props, i) => <Frame key={props.url} i={i} handleGodrays={handleGodrays} {...props} ref={itemsRef} /> /* prettier-ignore */)}
      </group>
      {itemsRef.current[0] && (
        <EffectComposer disableNormalPass multisampling={0}>
          {hovered < 6 && <GodRays ref={god} sun={itemsRef.current[hovered]} density={0.4} weight={0.4} exposure={0.4} decay={0.8} blur />}
          <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={0.0} intensity={0.3} />
        </EffectComposer>
      )}
    </>

  )
}

export const ImageFadeMaterial = shaderMaterial(
  {
    tex1: undefined,
    tex2: undefined,
    opac: 0,
    time: 0
  },
  ` varying vec2 vUv;

  uniform float time;

  //
  // Description : Array and textureless GLSL 2D/3D/4D simplex
  //               noise functions.
  //      Author : Ian McEwan, Ashima Arts.
  //  Maintainer : ijm
  //     Lastmod : 20110822 (ijm)
  //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
  //               Distributed under the MIT License. See LICENSE file.
  //               https://github.com/ashima/webgl-noise
  //
  
  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 permute(vec4 x) {
       return mod289(((x*34.0)+1.0)*x);
  }
  
  vec4 taylorInvSqrt(vec4 r)
  {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  
  float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    
    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
    
    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
  
    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
    
    // Permutations
    i = mod289(i);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
             
    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;
  
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
  
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
  
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
  
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
  
    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
  
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    
    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }

    void main() {
      vUv = uv;

      vec3 pos = position;

      float noiseFreq = 0.5;
      float noiseAmp = 0.25; 
      vec3 noisePos = vec3(pos.x * noiseFreq + time * 0.01, pos.y * noiseFreq + time * 0.004, pos.z);
      pos.z += snoise(noisePos) * noiseAmp;

      gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    }`,
  ` varying vec2 vUv;
    uniform sampler2D tex1;
    uniform sampler2D tex2;
    uniform float opac;
    void main() {
      vec2 uv = vUv;
      vec4 _texture = texture2D(tex1, uv);
      vec4 _texture2 = texture2D(tex2, uv);
      vec4 finalTexture = mix(_texture, _texture2, opac);
      gl_FragColor = finalTexture;
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }`
)

extend({ ImageFadeMaterial })

const Frame = memo(forwardRef((props, itemsRef) => {
  const { url, music, texture1, texture2, i, idd } = props
  const vitrail = useRef()
  // const frame = useRef()
  const vec = new THREE.Vector3()
  const c = new THREE.Color()
  const [, params] = useRoute('/item/:id')
  const shaderRef = useRef()
  const hovered = useRef(false)
  // const [invisible, setInvisible] = useState(false)
  const invisible = useRef(false)
  // const [isPlaying, setIsPlaying] = useState(false);
  const isPlaying = useRef(false)
  const [rnd] = useState(() => Math.random())
  const name = getUuid(url)
  const isActive = params?.id === name
  const [play, { stop, sound }] = useSound(music, {});
  const light = useRef()

  const viewport = useThree((state) => state.viewport)
  const depthBuffer = useDepthBuffer();

  const [tex1, tex2] = useTexture([texture1, texture2])
  const handleHover = (s, h) => {
    hovered.current = (h)
    props.handleGodrays(h, i)
    if (!isPlaying.current && (h || isActive)) {
      isPlaying.current = (true)
      if (s) s.fade(0, 1, 1000)
      play()
    } else if ((!h && !isActive)) {
      if (s) s.fade(1, 0, 250)
      isPlaying.current = (false)
      setTimeout(() => { stop() }, 250)
    }
  }

  console.log('rerender')

  console.log(shaderRef.current)

  useCursor(hovered.current)
  useFrame((state, dt) => {
    // console.log(idd, invisible.current)
    // console.log(vitrail.current.children[0])
  shaderRef.current.uniforms.time.value += 1
  console;log(shaderRef.current)
    easing.damp(shaderRef.current, 'opac', invisible.current ? 1 : 0, cubic.inOut(0.4), dt)
    easing.damp3(vitrail.current.children[0].scale, (!isActive && hovered.current ? 1.1 : 1), cubic.inOut(0.4), dt)
  })
  return (
    <group {...props}>
      {/* <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh> */}
      <Scroll>

        <group ref={vitrail} >
          <mesh receiveShadow position={[0, 0, 0.1]}
            ref={el => itemsRef.current[i] = el}
            key={i}
            trueId={i}
            name={name}
            transparent={true}
            onPointerOver={(e) => (e.stopPropagation(), handleHover(sound, true))}
            onPointerOut={() => (handleHover(sound, false))}>
            <planeBufferGeometry attach="geometry" args={[3.1 * 1.3, 10 * 1.3, 100, 100]} />
            <imageFadeMaterial ref={shaderRef} attach="material" tex1={tex1} tex2={tex2} transparent={true} colorSpace={THREE.SRGBColorSpace} />
          </mesh>
        </group>

        {/* <SpotLight castShadow ref={light} penumbra={0} distance={60} angle={3.5} attenuation={5} anglePower={4} intensity={2} color="red" position={[0, 5, 1.5]} depthBuffer={depthBuffer} /> */}
      </Scroll>
      <ui.In>
        <div className={`cartel_wrapper ${isActive ? 'cartel_active' : ''}`}>
          <h1 className='cartel_title'>{props.genre}</h1>
          <p className='cartel_description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <buttton className={`cartel_button ${isActive ? 'button_active' : ''}`} onClick={(e) => (e.stopPropagation(), invisible.current = !invisible.current)}>Discover references</buttton>
        </div>
        {/* <p className={`radio ${(hovered || isActive) ? 'radio_active' : ''}`}>Now playing {props.genre}</p> */}
      </ui.In>
      {/* <Text maxWidth={0.1} anchorX="left" anchorY="bottom" position={[0.55, GOLDENRATIO, 0]} fontSize={0.025}>
        {name.split('-').join(' ')}
      </Text> */}
    </group>
  )
}))