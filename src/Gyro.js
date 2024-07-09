import { useFrame, useThree } from "@react-three/fiber"
import { easing } from "maath"
import { cubic } from "maath/easing"
import { useEffect } from "react"

export const Gyro = () => {

    const camera = useThree((state) => state.camera)
    let test = 0
    let previous = 0;

    const deviceMotion = (e) => {
        console.log(e)
        test = +(e.alpha * 3,14159 / 180).toFixed(2)
        camera.rotation.y = e.alpha / 10
        console.log(camera.rotation.y)
    }

    useFrame((state, dt) => {
        easing.damp3(state.camera.rotation, [0, test, 0], 0.1, dt)
    })


    useEffect(() => {
        window.addEventListener('deviceorientation', deviceMotion)
        return () => window.removeEventListener('deviceorientation', deviceMotion)
    }, [])
}