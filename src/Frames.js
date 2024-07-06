import { useEffect, useRef, useState, useCallback } from 'react'
import { useRoute, useLocation } from 'wouter'
import { Quaternion, Vector3 } from "three"
import { cubic, quint, circ, quart, expo } from 'maath/easing'
import { easing } from 'maath'
import { clamp } from 'maath/misc'
import gsap, { Cubic } from 'gsap'

import { EffectComposer, GodRays, Bloom, SSR } from '@react-three/postprocessing'
import { ScrollControls, useScroll } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useGesture } from '@use-gesture/react'

import { Frame } from "./Frame"
import { lerp } from './utils.js'
import { useFramesStore } from './store.js'

export function Frames({ vitraux, q = new Quaternion(), p = new Vector3() }) {
  const ref = useRef([])
  const clicked = useRef()
  const god = useRef()
  const [hovered, setHovered] = useState(0)
  const itemsRef = useRef([]);
  const [, params] = useRoute('/item/:id')
  const [, setLocation] = useLocation()
  // const data = useScroll()
  let active = false;
  let isDragging = false
  const [expo, setExpo] = useState(0);

  const camera = useThree((state) => state.camera)

  console.log(camera.position)
  // const {
  //   changeHoverId,
  //   changeFocusId,
  // } = useFramesStore((s) => s);

  useEffect(() => {
    // const a = data.range(0, 1)
    clicked.current = ref.current.getObjectByName(params?.id)
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true)
      clicked.current.parent.localToWorld(p.set(0, 5, 2))
      gsap.to(camera.position, {
        x: p.x, y: p.y, z: p.z,
        duration: 2,
        ease: Cubic.easeInOut
      });
      clicked.current.parent.getWorldQuaternion(q)
      active = true;
    } else {
      gsap.to(camera.position, {
        x: 0, y: 0, z: 5.5,
        duration: 2,
        ease: Cubic.easeInOut
      });
      q.identity()
      active = false;
    }
  })

  const change = (hover, index) => {
    setHovered(index);
  }

  const handleGodrays = useCallback(change, [setHovered])

  useFrame((state, dt) => {
    // ref.current.rotation.y += 0.01
    // if (!active && data) data.el.scrollTop = lerp(data.el.scrollTop, 0, 0.1)

    if (god.current && god.current.blendMode && clicked.current) {
      god.current.blendMode.opacity.value = lerp(god.current.blendMode.opacity.value, 0.1, cubic.inOut(0.7))
    }
    else if (god.current && god.current.blendMode) {
      god.current.blendMode.opacity.value = lerp(god.current.blendMode.opacity.value, Math.abs(Math.sin(state.clock.elapsedTime)), cubic.inOut(0.7))
      // console.log(god.current.blendMode.opacity.value)
      // if (hovered) easing.damp(god.current.blendMode.opacity, 'value', 1, cubic.inOut(0.6), dt)
      // else easing.damp(god.current.blendMode.opacity, 'value', 0, cubic.inOut(0.6), dt)
    }
    // Try to change exposure
    // if (hovered != 1) exposure = lerp(exposure, 0.2, 0.1)
    // else exposure = lerp(exposure, 0, 0.1)
    // easing.damp3(state.camera.position, p, circ.inOut(0.8), dt)
    easing.dampQ(state.camera.quaternion, q, circ.inOut(0.6), dt)
  })

  // const onScroll = (e) => {
  //   console.log(e);
  //   dtScroll.current += e.deltaY / 10000
  //   console.log(dtScroll.current);
  // }
  useEffect(() => {
    console.log(clicked.current)
    // if (clicked.current === null) {
    //   document.removeEventListener('wheel', onScroll)
    // } else {
    //   document.addEventListener('wheel', onScroll)
    // }
    // return () => {
    //   document.removeEventListener('wheel', onScroll)
    // }
  }, [clicked])

  const boundaries = [-100, 100, 100, -100]

  let xTo = gsap.quickTo(camera.position, 'x', { duration: 0, ease: "power3" });
  let yTo = gsap.quickTo(camera.position, 'y', { duration: 0, ease: "power3" });
  return (
    <>
      <group
        ref={ref}
        onClick={(e) => { if (isDragging) return; else (e.stopPropagation(), setLocation(clicked.current === e.object ? '/' : '/item/' + e.object.name)) }}
        // Add changeHoverId(false), or setHovered(undefined)
        // {...bind()}
        onPointerMissed={() => (setLocation('/'), setHovered(undefined))}>
        {vitraux.map((props, i) => <Frame key={i} i={i} handleGodrays={handleGodrays} {...props} length={vitraux.length} ref={itemsRef} /> /* prettier-ignore */)}
      </group>
      {itemsRef.current[0] && (
        <EffectComposer disableNormalPass multisampling={0}>
          {hovered < 8 && <GodRays ref={god} sun={itemsRef.current[hovered]} density={0.4} weight={0.4} exposure={0.4} decay={0.8} blur />}
          <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={0.0} intensity={0.3} />
          {/* <SSR /> */}
        </EffectComposer>
      )}
    </>

  )
}