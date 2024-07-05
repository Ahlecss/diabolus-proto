import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ScrollControls, useAspect } from '@react-three/drei'

import { Overlay } from './Overlay.js'
import { Frames } from './Frames.js'

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
          <ScrollControls pages={1.45} damping={0.1}>
            <ScrollWrapper vitraux={vitraux} />
          </ScrollControls>
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
function ScrollWrapper({ vitraux }) {
  const size = useAspect(1800, 1000)

  return (
    <>
      <Frames vitraux={vitraux} />
      {/* <mesh scale={size} position={[0, 0, -10]}>
        <Sphere>
          <Suspense fallback={<></>}>
            <VideoMaterial url="/foamy2.mp4" />
          </Suspense>
        </Sphere>
      </mesh> */}
    </>
  )
}

// function VideoMaterial({ url }) {
//   const texture = useVideoTexture(url)
//   return <meshBasicMaterial map={texture} toneMapped={false} />
// }