import { forwardRef, memo, useEffect, useRef, useState } from "react"
import getUuidByString from "uuid-by-string"
import { useRoute } from "wouter"
import { easing } from "maath"
import { cubic } from "maath/easing"
import { SRGBColorSpace } from "three"

import { Scroll, shaderMaterial, useCursor, useDepthBuffer, useTexture } from "@react-three/drei"
import { extend, useFrame, useThree } from "@react-three/fiber"

import { useFramesStore } from "./store"

const ImageFadeMaterial = shaderMaterial(
  {
    tex1: undefined,
    tex2: undefined,
    opac: 0,
    time: 0
  },
  ` varying vec2 vUv;
  
          uniform float time;
          
          void main() {
            vUv = uv;
  
          vec3 pos = position;
  
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

export const Frame = memo(forwardRef((props, itemsRef) => {
  const { url, texture1, texture2, i, idd } = props
  const vitrail = useRef()
  // const frame = useRef()
  // Old Route way
  const [, params] = useRoute('/item/:id')
  const name = getUuidByString(url)

  const shaderRef = useRef()
  const cloudRef = useRef()
  const hovered = useRef(false)
  const invisible = useRef(false)
  const [rnd] = useState(() => Math.random())
  const isActive = params?.id === name
  // const [play, { stop, sound }] = useSound(music, {});
  const light = useRef()

  const viewport = useThree((state) => state.viewport)
  const depthBuffer = useDepthBuffer();

  const {
    hoverId,
    focusId,
    changeHoverId,
    changeFocusId,
  } = useFramesStore((s) => s);

  useEffect(() => {
    changeFocusId(isActive ? i : null)
    console.log(i)
  }, [isActive])

  const [tex1, tex2] = useTexture([texture1, texture2])

  // console.log('coucou', cloudRef.current)

  useCursor(hovered.current)
  useFrame((state, dt) => {
    // console.log(idd, invisible.current)
    // console.log(vitrail.current.children[0])
    // cloudRef.current.rotation.y -= dt
    // cloudRef.current.rotation.x -= dt * 0.5
    shaderRef.current.uniforms.time.value += 1
    // console.log(shaderRef.current)
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
            onPointerOver={(e) => { e.stopPropagation(), changeHoverId(i) }}
            onPointerOut={() => (changeHoverId(null))}
          >
            <planeBufferGeometry attach="geometry" args={[3.1 * 1.3, 10 * 1.3, 100, 100]} />
            <imageFadeMaterial ref={shaderRef} attach="material" tex1={tex1} tex2={tex2} transparent={true} colorSpace={SRGBColorSpace} />
          </mesh>

        </group>
        {/* <Clouds material={THREE.MeshBasicMaterial}>
            <Float
              speed={1} // Animation speed, defaults to 1
              rotationIntensity={3} // XYZ rotation intensity, defaults to 1
              floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
              floatingRange={[-7, -8]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
            >
              <Cloud layers={0} ref={cloudRef} color={'#aaa'} bounds={[6, 5, 5]} concentrate="outside" seed={2} position={[0, 0, 0]} segments={50} volume={6} fade={10} growth={4} />
            </Float>
            <Float
              speed={1} // Animation speed, defaults to 1
              rotationIntensity={4} // XYZ rotation intensity, defaults to 1
              floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
              floatingRange={[-6, -7]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
            >
              <Cloud layers={0} ref={cloudRef} color={'#aaa'} bounds={[6, 5, 5]} concentrate="outside" seed={3} position={[0, 0, 0]} segments={50} volume={6} fade={10} growth={4} />
            </Float>
          </Clouds> */}


        {/* <SpotLight castShadow ref={light} penumbra={0} distance={60} angle={3.5} attenuation={5} anglePower={4} intensity={2} color="red" position={[0, 5, 1.5]} depthBuffer={depthBuffer} /> */}
      </Scroll>
    </group>
  )
}))