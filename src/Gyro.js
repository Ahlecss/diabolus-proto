import { useThree } from "@react-three/fiber"
import { useEffect } from "react"

export const Gyro = () => {

    const camera = useThree((state) => state.camera)

    const deviceMotion = (e) => {
        console.log(e)
        console.log(`${e.acceleration.y} m/s2`);

        camera.rotation.y = e.rotationRate.gamma / 360
    }


    useEffect(() => {

        window.addEventListener('devicemotion', deviceMotion)
    }, [])
}