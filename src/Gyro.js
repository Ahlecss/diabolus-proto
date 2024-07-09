import { useFrame, useThree } from "@react-three/fiber"
import { easing } from "maath"
import { useEffect } from "react"

export const Gyro = () => {

    const camera = useThree((state) => state.camera)
    let test = 0

    const deviceMotion = (e) => {
        console.log(e)
        test = +(e.alpha / 360).toFixed(1)
        // camera.rotation.y = test
        console.log(camera.rotation.y)
    }

    useFrame(() => {
        easing.damp3(camera.rotation, [0, test, 0], cubic.inOut(0.1), dt)

    })


    useEffect(() => {
        window.addEventListener('deviceorientation', deviceMotion)
        return () => window.removeEventListener('deviceorientation', deviceMotion)
    }, [])
}