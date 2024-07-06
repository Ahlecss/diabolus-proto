import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ScrollControls, useAspect, useScroll } from '@react-three/drei'

import { Overlay } from './Overlay.js'
import { Frames } from './Frames.js'
import { easing } from 'maath'
import { cubic } from 'maath/easing'
import { useShallow } from 'zustand/react/shallow'
import { useFramesStore } from './store.js'
import { memo } from 'react'
import { useEffect } from 'react'

const GOLDENRATIO = 1.61803398875


export const App = ({ vitraux }) => {

  return (
    <>
      <Overlay />
      <Canvas shadows dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
        <ambientLight intensity={0.5} />
        {/* <color attach="background" args={['#191920']} /> */}
        {/* <fog attach="fog" args={['#191920', 0, 15 * 2]} /> */}
        <color attach="background" args={['#000']} />
        {/* <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.2} maxPolarAngle={Math.PI / 2.2} /> */}

        {/* <hemisphereLight intensity={0.5} /> */}
        {/* <ContactShadows resolution={1024} frames={1} position={[0, -7, 0]} scale={15} blur={0.5} opacity={1} far={20} /> */}

        <group position={[0, -0.5, 0]}>
          {/* <ScrollControls infinite pages={1.45} damping={0.1}> */}
          <ScrollWrap vitraux={vitraux} />
        </group>
        <Environment preset="city" />
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

  const { focusId } = useFramesStore(
    useShallow((state) => ({ focusId: state.focusId })),
  )

  return (
    // <ScrollControls infinite={focusId === null ? true : false} pages={focusId === null ? 15 : 1.45} damping={0.2}>
    <ScrollWrapper vitraux={vitraux} />
    // </ScrollControls>

  )
}

const ScrollRotation = memo(({ groupRef }) => {
  // const scroll = useScroll()

  // console.log(scroll.offset)
})
const ScrollVertical = ({ groupRef }) => {
  // const scroll = useScroll()

  useFrame((state, dt) => {
    // easing.dampE(groupRef.current.rotation, [0, state.clock.elapsedTime / 10, 0], cubic.inOut(0), dt)
    easing.damp3(groupRef.current.position, [0, scroll.offset * 10.5, 0], cubic.inOut(0), dt)
  })
}
const ScrollWrapper = memo(({ vitraux }) => {
  const size = useAspect(1800, 1000)

  const groupRef = useRef()

  const { focusId } = useFramesStore(
    useShallow((state) => ({ focusId: state.focusId })),
  )

  var dtScroll = useRef(0);

  const onRotate = (e) => {
    console.log(e);
    dtScroll.current += e.deltaY / 10000
    console.log(dtScroll.current);
  }
  const onScroll = (e) => {
    // console.log(e);
    // dtScroll.current += e.deltaY / 10000
    // console.log(dtScroll.current);
  }

  useEffect(() => {
    if (focusId === null) {
      document.addEventListener('wheel', onRotate)
      document.removeEventListener('wheel', onScroll)
    } else {
      document.removeEventListener('wheel', onRotate)
      document.addEventListener('wheel', onScroll)
    }
    return () => {
      document.removeEventListener('wheel', onRotate)
    }
  })

  useFrame((state, dt) => {
    // console.log(scroll.offset)
    easing.dampE(groupRef.current.rotation, [0, Math.PI * 2 * dtScroll.current, 0], cubic.inOut(0.4), dt)
  })

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
      {focusId === null && <ScrollRotation groupRef={groupRef} />}
    </group>

  )
})

// function VideoMaterial({ url }) {
//   const texture = useVideoTexture(url)
//   return <meshBasicMaterial map={texture} toneMapped={false} />
// }