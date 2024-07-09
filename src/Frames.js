import { useEffect, useRef, useState, useCallback, memo } from 'react'
import { useRoute, useLocation } from 'wouter'
import { isMobile } from 'react-device-detect'
import { Quaternion, Vector3 } from "three"
import { cubic, circ } from 'maath/easing'
import { easing } from 'maath'
import gsap, { Cubic, Power3 } from 'gsap'

import { EffectComposer, GodRays, Bloom, SSR } from '@react-three/postprocessing'
import { useFrame, useThree } from '@react-three/fiber'

import { lerp } from './utils.js'
import { Frame } from "./Frame"
import { CameraRotate } from './CameraRotate.js'
import { Gyro } from './Gyro.js'

export const Frames = memo(({ vitraux, q = new Quaternion(), p = new Vector3() }) => {
  const ref = useRef([])
  const clicked = useRef()
  const god = useRef()
  const [hovered, setHovered] = useState(0)
  const itemsRef = useRef([]);
  const [, params] = useRoute('/item/:id')
  const [, setLocation] = useLocation()
  const camera = useThree((state) => state.camera)

  const groupXTo = gsap.quickTo(ref.current.position, 'x', { duration: 0.1, ease: Power3.easeOut });
  const groupYTo = gsap.quickTo(ref.current.position, 'y', { duration: 0.1, ease: Power3.easeOut });
  const groupZTo = gsap.quickTo(ref.current.position, 'z', { duration: 0.1, ease: Power3.easeOut });

  const resetXTo = gsap.quickTo(ref.current.position, 'x', { duration: 3, ease: Power3.easeOut });
  const resetYTo = gsap.quickTo(ref.current.position, 'y', { duration: 3, ease: Power3.easeOut });
  // const data = useScroll()
  // const [expo, setExpo] = useState(0);
  let active = false;
  let isDragging = false;
  let canDrag = false;
  let startX = 0;
  let startY = 0;
  let offsetX = 0;
  let offsetY = 0;

  // Use Drag mobile in a specific component ? With clicked current as a props
  const onMouseDown = (e) => {
    console.log('onMouseDown', clicked.current);
    if (!clicked.current) return
    canDrag = true;
    startX = e.clientX / (isMobile ? 20 : 100);
    startY = e.clientY / (isMobile ? 20 : 100);
  }
  const onMouseMove = (e) => {
    if (!canDrag) return
    isDragging = true
    offsetX = e.clientX / 100 - startX
    offsetY = e.clientY / 100 - startY
    startX = e.clientX / 100
    startY = e.clientY / 100
    console.log('mousemove', e.client, startX);

    groupYTo(Math.max(0, Math.min(ref.current.position.y - offsetY, 10.5)))
    if (clicked.current.type === 'triple') {
      groupXTo(Math.max(-3.5, Math.min(ref.current.position.x + offsetX * clicked.current.ratios.x, 4.5)))
      groupZTo(Math.max(-3.5, Math.min(ref.current.position.z + (offsetX * clicked.current.ratios.z), 4.5)))
    }
  }
  const onTouchMove = (e) => {
    if (!canDrag) return
    isDragging = true
    offsetX = e.changedTouches[0].pageX / 20 - startX
    offsetY = e.changedTouches[0].pageY / 20 - startY
    startX = e.changedTouches[0].pageX / 20
    startY = e.changedTouches[0].pageY / 20
    console.log('mousemove', e.client, startX);

    groupYTo(Math.max(0, Math.min(ref.current.position.y - offsetY, 10.5)))
    if (clicked.current.type === 'triple') {
      groupXTo(Math.max(-3.5, Math.min(ref.current.position.x + offsetX * clicked.current.ratios.x, 4.5)))
      groupZTo(Math.max(-3.5, Math.min(ref.current.position.z + (offsetX * clicked.current.ratios.z), 4.5)))
    }
  }
  const onMouseUp = (e) => {
    if (!isDragging) {
      e.stopPropagation()
      setLocation(clicked.current === e.object ? '/' : '/item/' + e.object.name)

      // Refacto to longer
      resetXTo(0)
      resetYTo(0)

      // offsetX = 0;
      // offsetY = 0;
    }
    isDragging = false
  }
  const onMouseUp2 = () => {
    canDrag = false;
  }

  const addDragEvents = () => {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('touchmove', onTouchMove)
    document.addEventListener('mouseup', onMouseUp2)
    document.addEventListener('touchend', onMouseUp2)
  }
  const removeDragEvents = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('mouseup', onMouseUp2)
    document.removeEventListener('touchend', onMouseUp2)
  }

  useEffect(() => {
    clicked.current = ref.current.getObjectByName(params?.id)
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true)
      clicked.current.parent.localToWorld(p.set(0, 5, isMobile ? 4 : 2))
      gsap.to(camera.position, {
        x: p.x, y: p.y, z: p.z,
        duration: 1,
        ease: Cubic.easeInOut
      });
      clicked.current.parent.getWorldQuaternion(q)
      active = true;
      addDragEvents()
      // camera.lookAt(p)
      // console.log(camera.rotation.y)
      // camera.rotation.y = clicked.current.parent.parent.rotation.y
      // console.log(camera.rotation)
      // console.log(clicked.current)
    } else {
      gsap.to(camera.position, {
        x: 0, y: 0, z: 5.5,
        duration: 1,
        ease: Cubic.easeInOut
      });
      q.identity()
      active = false;

      removeDragEvents()
    }

    return () => removeDragEvents()
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
    if (!isMobile && clicked.current !== null) {
      easing.dampQ(state.camera.quaternion, q, circ.inOut(0.6), dt)
    }
  })

  return (
    <>
      <group
        ref={ref}
        onPointerDown={onMouseDown}
        onPointerUp={onMouseUp}
        // Add changeHoverId(false), or setHovered(undefined)
        onPointerMissed={() => (setLocation('/'), setHovered(undefined))}>
        {vitraux.map((props, i) => <Frame key={i} i={i} handleGodrays={handleGodrays} {...props} length={vitraux.length} ref={itemsRef} /> /* prettier-ignore */)}
      </group>

      {isMobile && <Gyro isActive={clicked.current} />}
      {!isMobile && <CameraRotate />}
      {
        itemsRef.current[0] && (
          <EffectComposer disableNormalPass multisampling={0}>
            {hovered < 8 && <GodRays ref={god} sun={itemsRef.current[hovered]} density={0.4} weight={0.4} exposure={0.4} decay={0.8} blur />}
            <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={0.0} intensity={0.3} />
            {/* <SSR /> */}
          </EffectComposer>
        )
      }
    </>

  )
})