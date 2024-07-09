import { useThree } from "@react-three/fiber"
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
        camera.rotation.y = test
    })


    useEffect(() => {
        window.addEventListener('deviceorientation', deviceMotion)
        return () => window.removeEventListener('deviceorientation', deviceMotion)
    }, [])
}