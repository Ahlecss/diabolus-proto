import * as THREE from 'three'
import { useEffect, useRef, useState, forwardRef, useCallback, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, Environment, Html, useTexture, useScroll, ScrollControls, Scroll, SpotLight, useDepthBuffer } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing } from 'maath'
import getUuid from 'uuid-by-string'
import tunnel from 'tunnel-rat'
import useSound from 'use-sound';

import { lerp } from './utils.js'
import { EffectComposer, GodRays, Bloom } from '@react-three/postprocessing'

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
  let exposure = 0;
  useEffect(() => {
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

  const handleGodrays = useCallback(change, [hovered])
  useFrame((state, dt) => {
    if (god.current) god.current.attributes = 0
    if (!active && data) data.el.scrollTop = lerp(data.el.scrollTop, 0, 0.1)
    if (hovered != 1) exposure = lerp(exposure, 0.2, 0.1)
    else exposure = lerp(exposure, 0, 0.1)
    easing.damp3(state.camera.position, p, 0.4, dt)
    easing.dampQ(state.camera.quaternion, q, 0.4, dt)
  })
  return (
    <>
      <group
        ref={ref}
        onClick={(e) => (e.stopPropagation(), setLocation(clicked.current === e.object ? '/' : '/item/' + e.object.name))}
        onPointerMissed={() => setLocation('/')}>
        {vitraux.map((props, i) => <Frame key={props.url} i={i} handleGodrays={handleGodrays} {...props} ref={itemsRef} /> /* prettier-ignore */)}
      </group>
      {itemsRef.current[5] && (
        <EffectComposer disableNormalPass multisampling={0}>
          {hovered < 6 && <GodRays ref={god} sun={itemsRef.current[hovered]} exposure={0.1} decay={0.8} blur />}
          <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={0.0} intensity={0.3} />
        </EffectComposer>
      )}
    </>

  )
}

const Frame = forwardRef((props, itemsRef) => {
  const { url, music, texture, i, idd } = props
  const vitrail = useRef()
  // const frame = useRef()
  const vec = new THREE.Vector3()
  const c = new THREE.Color()
  const [, params] = useRoute('/item/:id')
  const [hovered, hover] = useState(false)
  // const [invisible, setInvisible] = useState(false)
  const invisible = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false);
  const [rnd] = useState(() => Math.random())
  const name = getUuid(url)
  const isActive = params?.id === name
  const [play, { stop, sound }] = useSound(music, {});
  const light = useRef()

  const viewport = useThree((state) => state.viewport)
  const depthBuffer = useDepthBuffer();

  const tex = useTexture(texture)
  const handleHover = (s, h) => {
    hover(h)
    props.handleGodrays(h, i)
    if (!isPlaying && (h || isActive)) {
      setIsPlaying(true)
      if(s)s.fade(0, 1, 1000)
      play()
    } else if ((!h && !isActive)) {
      if(s)s.fade(1, 0, 250)
      setIsPlaying(false)
      setTimeout(() => { stop() }, 250)
    }
  }

  console.log('rerender')

  useCursor(hovered)
  useFrame((state, dt) => {

    // console.log(itemsRef.current[i])

    // light.current.target.position.lerp(vec.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 0), 0.1)
    // light.current.target.updateMatrixWorld()
    if (idd % 2 === 0) {
      // vitrail.current.needsUpdate = true
      easing.damp(vitrail.current.children[0].material, 'opacity', invisible.current ? 0 : 1, 0.1, dt)
    }
    // vitrail.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2

    // if (props.idd % 2 !== 0) {
    easing.damp3(vitrail.current.children[0].scale, (!isActive && hovered ? 1.1 : 1), 0.1, dt)
    // }
    // easing.dampC(frame.current.material.color, hovered ? '#D31D1C' : 'white', 0.1, dt)
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
            <planeBufferGeometry attach="geometry" args={[3.1 * 1.3, 10 * 1.3]} />
            <meshBasicMaterial attach="material" map={tex} transparent={true} colorSpace={THREE.SRGBColorSpace} />
          </mesh>
        </group>

        {/* <SpotLight castShadow ref={light} penumbra={0} distance={60} angle={3.5} attenuation={5} anglePower={4} intensity={2} color="red" position={[0, 5, 1.5]} depthBuffer={depthBuffer} /> */}
      </Scroll>
      <ui.In>
        <div className={`cartel_wrapper ${isActive ? 'cartel_active' : ''}`}>
          <h1 className='cartel_title'>{props.genre}</h1>
          <p className='cartel_description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <buttton className='cartel_button' onClick={(e) => (e.stopPropagation(), invisible.current = !invisible.current, handleHover(sound, true))}>Discover references</buttton>
        </div>
        {/* <p className={`radio ${(hovered || isActive) ? 'radio_active' : ''}`}>Now playing {props.genre}</p> */}
      </ui.In>
      {/* <Text maxWidth={0.1} anchorX="left" anchorY="bottom" position={[0.55, GOLDENRATIO, 0]} fontSize={0.025}>
        {name.split('-').join(' ')}
      </Text> */}
    </group>
  )
})
