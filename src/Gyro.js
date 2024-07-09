import { useFrame, useThree } from "@react-three/fiber"
import { easing } from "maath"
import { cubic } from "maath/easing"
import { useEffect } from "react"

export const Gyro = () => {

    const camera = useThree((state) => state.camera)
    let test = 0

    const deviceMotion = (e) => {
        console.log(e)
        test = +(e.alpha * 3,14159 / 180).toFixed(2)
        // camera.rotation.y = test
    }
    
    useFrame((state, dt) => {
        easing.damp3(camera.rotation, [0, test, 0], cubic.inOut(0.1), dt)
        console.log(camera.rotation.y)
    })


    useEffect(() => {
        window.addEventListener('deviceorientation', deviceMotion)
        return () => window.removeEventListener('deviceorientation', deviceMotion)
    }, [])
}