import { forwardRef, memo, useEffect, useRef, useState } from "react"
import getUuidByString from "uuid-by-string"
import { useRoute } from "wouter"
import { easing, random } from "maath"
import { cubic } from "maath/easing"
import { DoubleSide, MeshBasicMaterial, ShaderMaterial, SRGBColorSpace, TextureLoader, Vector3 } from "three"

import { Cloud, Clouds, CubeCamera, Float, Scroll, ScrollControls, shaderMaterial, useBoxProjectedEnv, useCursor, useDepthBuffer, useTexture, useGLTF } from "@react-three/drei"
import { extend, useFrame, useThree } from "@react-three/fiber"
import { useGesture, useDrag } from '@use-gesture/react'

import { useFramesStore } from "./store"
import { useShallow } from "zustand/react/shallow"

import vitrail from "./model/test.glb"
import atlas from "./images/AtlasFinal.png"

export const Frame = memo(forwardRef((props, itemsRef) => {
  const { url, texture1, texture2, type, ratios, i, idd, length } = props

  const vitrail = useRef()
  // const frame = useRef()
  // Old Route way
  const [, params] = useRoute('/item/:id')
  const name = getUuidByString(url)

  const cloudRef = useRef()
  const projection = useRef()
  const hovered = useRef(false)
  const isActive = params?.id === name

  const camera = useThree((state) => state.camera)

  const [rnd] = useState(() => Math.random())
  // const [play, { stop, sound }] = useSound(music, {});
  // const invisible = useRef(false)
  const light = useRef()

  const viewport = useThree((state) => state.viewport)
  const depthBuffer = useDepthBuffer();


  const { changeHoverId, changeFocusId, invisible, focusId } = useFramesStore(
    useShallow((state) => ({ changeHoverId: state.changeHoverId, changeFocusId: state.changeFocusId, invisible: state.invisible, focusId: state.focusId })),
  )


  console.log('rerender', focusId)

  useEffect(() => {
    changeFocusId(isActive ? i : null)

    // if(!isActive) props.handleGodrays(false, i)
  }, [isActive])

  const pointerEvent = (e, isOver) => {
    e.stopPropagation()
    hovered.current = isOver
    changeHoverId(isOver ? i : null)
    props.handleGodrays(isOver, i)
    // handleGodrays(isOver, i)
  }

  // console.log('coucou', cloudRef.current)

  useCursor(hovered.current)
  useFrame((state, dt) => {
    // console.log(idd, invisible.current)
    // console.log(vitrail.current.children[0])
    // cloudRef.current.rotation.y -= dt * 0.1
    // cloudRef.current.rotation.x -= dt * 0.14
    // if(shaderRef.current.material.uniforms.time) shaderRef.current.material.uniforms.time.value += 1
    // console.log(shaderRef.current.material.uniforms)
    // console.log(shaderRef.current)
    // easing.damp(shaderRef.current.material.uniforms, 'opac', Math.sin(state.clock.elapsedTime), cubic.inOut(0.4), dt)
    // easing.damp3(vitrail.current.children[0].scale, (!isActive && hovered.current ? 1.1 : 1), cubic.inOut(0.4), dt)
  })
  return (
    <group
      position={[
        15 * Math.sin(2 * Math.PI * ((i + 1) / length)),
        1.5,
        0 + 15 * -Math.cos(2 * Math.PI * ((i + 1) / length))]}
    // rotation={[0,
    //   -2 * Math.PI * ((i + 1) / length),
    //   0]}
    >
      {/* <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
            <boxGeometry />
            <meshBasicMaterial toneMapped={false} fog={false} />
          </mesh> */}
      {/* <Scroll> */}
      <group ref={vitrail} >
        <mesh receiveShadow position={[0, 0, 0]}
          ref={el => itemsRef.current[i] = el}
          key={i}
          type={type}
          ratios={ratios}
          center={true}
          trueId={i}
          name={name}
          transparent={true} renderOrder={1}
          onPointerOver={(e) => pointerEvent(e, true)}
          onPointerOut={(e) => pointerEvent(e, false)}
        >
          {/* <planeBufferGeometry attach="geometry" args={[3.1 * 1.3 * (type === 'simple' ? 1 : 3), 10 * 1.3, 100, 100]} />
          <imageFadeMaterial ref={shaderRef} attach="material" tex1={tex1} tex2={tex2} transparent={true} renderOrder={1} colorSpace={SRGBColorSpace} toneMapped={false} /> */}
          <Model texture1={texture1} texture2={texture2} />
        </mesh>


      </group>

      {/* <Puffycloud seed={10} /> */}

      {/* <Clouds> */}

      {/* <Float
          speed={1} // Animation speed, defaults to 1
          rotationIntensity={0.2} // XYZ rotation intensity, defaults to 1
          floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
          floatingRange={[11, 12]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
        >
          <Cloud layers={0} ref={cloudRef} color={'#aaa'} bounds={[5, 2, 1]} concentrate="outside" seed={Math.random()* 10} position={[0, 0, 0]} segments={10} volume={10} fade={1} growth={4} speed={0.2} opacity={Math.random()} />
        </Float> */}
      {/* <Float
          speed={1} // Animation speed, defaults to 1
          rotationIntensity={0} // XYZ rotation intensity, defaults to 1
          floatIntensity={0.6} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
          floatingRange={[12, 13]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
        >
          <Cloud layers={0} ref={cloudRef} color={'#bbb'} bounds={[6, 5, 5]} concentrate="outside" seed={3} position={[0, 0, 0]} segments={10} volume={10} fade={0} growth={4} speed={1} opacity={Math.random()} />
        </Float> */}
      {/* </Clouds> */}


      {/* <SpotLight castShadow ref={light} penumbra={0} distance={60} angle={3.5} attenuation={5} anglePower={4} intensity={2} color="red" position={[0, 5, 1.5]} depthBuffer={depthBuffer} /> */}
      {/* </Scroll> */}
    </group >
  )
}))

const Model = (props) => {
  const { nodes, materials } = useGLTF(vitrail)

  // const tex1 = materials.VitrailTriple_THRASHMETAL_Legendes.map

  const atlasTexture = useTexture(atlas)
  const tex1 = useTexture(props.texture1)
  const tex2 = useTexture(props.texture2)

  const shaderRef = useRef()
  console.log(materials.VitrailTriple_THRASHMETAL_Legendes.map)

  useFrame((state, dt) => {
    // console.log(idd, invisible.current)
    // console.log(vitrail.current.children[0])
    // cloudRef.current.rotation.y -= dt * 0.1
    // cloudRef.current.rotation.x -= dt * 0.14
    // if (shaderRef.current.material.uniforms.time) shaderRef.current.material.uniforms.uniforms.time.value += 1
    // console.log(shaderRef.current.material.uniforms)
    // console.log(shaderRef.current.material.uniforms)
    easing.damp(shaderRef.current.material.uniforms, 'opac', Math.sin(state.clock.elapsedTime), cubic.inOut(0.4), dt)
    // easing.damp3(vitrail.current.children[0].scale, (!isActive && hovered.current ? 1.1 : 1), cubic.inOut(0.4), dt)
  })

  const ImageFadeMaterial = useRef(new ShaderMaterial({
    uniforms: {
      tex1: { value: atlasTexture },
      tex2: { value: tex2 },
      opac: 0,
      time: 0
    },
    vertexShader: ` varying vec2 vUv;
  
          uniform float time;
          
          void main() {
            vUv = uv;
  
          vec3 pos = position;
  
          gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
      }`,
    fragmentShader: ` varying vec2 vUv;
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
  }))

  return (
    <group {...props} dispose={null} scale={[10, 10, 10]}>
      <mesh geometry={nodes.Parent.geometry} ref={shaderRef} material={ImageFadeMaterial.current} rotation={[Math.PI / 2, 0, -Math.PI / 2]}>
        <mesh geometry={nodes.Plan1.geometry} material={ImageFadeMaterial.current} onPointerOver={(e) => e.object.position.z = 0.1} />
        <mesh geometry={nodes.Plan2.geometry} material={ImageFadeMaterial.current}/>
      </mesh>
    </group>

    
  )
}

useGLTF.preload(vitrail)
