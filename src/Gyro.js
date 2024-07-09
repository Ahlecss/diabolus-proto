import { useThree } from "@react-three/fiber"
import { useEffect } from "react"

export const Gyro = () => {

    const camera = useThree((state) => state.camera)

    const deviceMotion = (e) => {
        console.log(e)
        camera.rotation.y = e.alpha / 120
    }


    useEffect(() => {
        window.addEventListener('deviceorientation', deviceMotion)
        return () => window.removeEventListener('deviceorientation', deviceMotion)
    }, [])
}