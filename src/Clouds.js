import { Cloud, Clouds, useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { random } from "maath"
import { useRef, useState } from "react"
import { Vector3 } from "three"

import cloudImg from './images/clouds.jpg'

export function Puffycloud({ seed, vec = new Vector3(), ...props }) {
  const api = useRef()
  const light = useRef()

  const texture1 = useTexture(cloudImg);

  // const rig = useContext(context)
  const [flash] = useState(() => new random.FlashGen({ count: 10, minDuration: 40, maxDuration: 200 }))
  // const contact = (payload) => payload.other.rigidBodyObject.userData?.cloud && payload.totalForceMagnitude / 1000 > 100 && flash.burst()
  useFrame((state, delta) => {
    const impulse = flash.update(state.clock.elapsedTime, delta)
    // light.current.intensity = impulse * 150
    console.log(light.current)
    // if (impulse === 1) rig?.current?.setIntensity(1)
    // api.current?.applyImpulse(vec.copy(api.current.translation()).negate().multiplyScalar(10))
  })
  return (
<></>
    // <Clouds position={[0, 5, -5]} texture={cloudImg}>
    //   {/* <RigidBody ref={api} userData={{ cloud: true }} onContactForce={contact} linearDamping={4} angularDamping={1} friction={0.1} {...props} colliders={false}> */}
    //   {/* <BallCollider args={[4]} /> */}
    //   <Cloud seed={seed} fade={1} speed={0.1} growth={10} segments={10} volume={10} opacity={0.3} bounds={[10, 10, 1]} />
    //   <Cloud seed={seed + 1} fade={1} position={[0, 1, 0]} speed={0.1} growth={10} segments={10} volume={10} opacity={0.6} bounds={[10, 10, 1]} />
    //   {/* </RigidBody> */}
    // </Clouds>
  )
}