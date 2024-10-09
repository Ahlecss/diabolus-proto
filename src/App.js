import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Cloud, Clouds, CubeCamera, Environment, OrbitControls, Reflector, ScrollControls, useAspect, useBoxProjectedEnv, useScroll, useTexture } from '@react-three/drei'

import { Overlay } from './Overlay.js'
import { Frames } from './Frames.js'
import { easing, random } from 'maath'
import { cubic } from 'maath/easing'
import { useShallow } from 'zustand/react/shallow'
import { useFramesStore } from './store.js'
import { memo } from 'react'
import { useEffect } from 'react'
import { useDrag, useGesture } from '@use-gesture/react'
import { vitrauxData } from './vitrauxData.js'
import { Vector3 } from 'three'
import { Puffycloud } from './Clouds.js'

const GOLDENRATIO = 1.61803398875

export const App = ({ vitraux }) => {

  return (
    <>
      <Overlay />
      <Canvas shadows dpr={[1, 1.5]} camera={{ near: 0.1, fov: 60, position: [0, 2, 15] }}>
        <ambientLight intensity={Math.PI / 2} />
        {/* <color attach="background" args={['#191920']} /> */}
        <fog attach="fog" args={['black', 10, 30]} />
        <color attach="background" args={['#000']} />
        {/* <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.2} maxPolarAngle={Math.PI / 2.2} /> */}

        {/* <hemisphereLight intensity={0.5} /> */}
        {/* <ContactShadows resolution={1024} frames={1} position={[0, -7, 0]} scale={15} blur={0.5} opacity={1} far={20} /> */}

        <group position={[0, -0.5, 0]}>
          {/* <ScrollControls infinite pages={1.45} damping={0.1}> */}
          {/* <ScrollControls enabled={focusId !== null} pages={focusId === null ? 0 : 1.45} damping={0.1}> */}
          <ScrollWrap vitraux={vitraux} />
        </group>

        {/* <Environment preset="city" /> */}

        {/* <Environment files="https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/hdris/noon-grass/noon_grass_1k.hdr" background/> */}
        {/* <mesh receiveShadow position={[0, -10, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[50, 50]} />
          <meshPhongMaterial />
        </mesh> */}

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

function ScrollWrap({ vitraux }) {

  const groupRef = useRef()

  const camera = useThree((state) => state.camera)

  const off = useRef({ x: 0, y: 0 })

  // Find a way to avoid camera value shiet
  // const bind = useDrag(({ down, offset: [x, y] }) => { { off.current.x = (x / 100), off.current.y = y / 100 } }, { delay: 200 })

  // useFrame(() => {
  //   camera.position.x = camera.position.x + off.current.x
  //   camera.position.y = camera.position.y + off.current.y
  //   off.current.x = 0
  //   off.current.y = 0
  // })
  return (
    // <ScrollControls infinite={focusId === null ? true : false} pages={focusId === null ? 15 : 1.45} damping={0.2}>
    <group ref={groupRef} /*{...bind()}*/>
      <ScrollWrapper vitraux={vitraux} />
    </group>
    // </ScrollControls>

  )
}
const ScrollVertical = ({ groupRef }) => {
  // const scroll = useScroll()

  useFrame((state, dt) => {
    // easing.dampE(groupRef.current.rotation, [0, state.clock.elapsedTime / 10, 0], cubic.inOut(0), dt)
    easing.damp3(groupRef.current.position, [0, scroll.offset * 10.5, 0], cubic.inOut(0), dt)
  })
}
const ScrollWrapper = ({ vitraux }) => {
  const size = useAspect(1800, 1000)

  const groupRef = useRef()
  const refreflector = useRef()

  const { setFramesRef } = useFramesStore(
    useShallow((state) => ({ setFramesRef: state.setFramesRef })),
  )

  useEffect(() => {
    setFramesRef(groupRef)
    // console.log(refreflector)
  }, [])


  return (
    <group ref={groupRef}>
      <Frames vitraux={vitraux} />
      {/* <mesh scale={size} position={[0, 0, -10]}>
        <Sphere>
          <Suspense fallback={<></>}>
            <VideoMaterial url="/foamy2.mp4" />
          </Suspense>
        </Sphere>
      </mesh> */}
      {/* {focusId && <ScrollVertical groupRef={groupRef} />} */}

      {/* <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, -3, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshNormalMaterial roughnessMap={floor} normalMap={normal} bumpMap={normal} wrapS/>
      </mesh> */}

      {/* <Reflector ref={refreflector} resolution={512} args={[50, 50]} mirror={0.4} mixBlur={4} mixStrength={5} rotation={[-Math.PI / 2, 0, Math.PI / 2]} blur={[100, 100]} position={[0, -7, 0]}>
        {(Material, props) => <Material color="#888" metalness={0.6} roughnessMap={floor} normalMap={normal} normalScale={[0.1, 0.1]} {...props} />}
      </Reflector> */}
    </group>

  )
}

// function VideoMaterial({ url }) {
//   const texture = useVideoTexture(url)
//   return <meshBasicMaterial map={texture} toneMapped={false} />
// }
