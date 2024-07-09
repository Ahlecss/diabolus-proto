import { useThree } from "@react-three/fiber"
import { useEffect } from "react"

export const Gyro = () => {

    const camera = useThree((state) => state.camera)
    let test = 0;

    const deviceMotion = (e) => {
        console.log(e)
        console.log(`${e.acceleration.y} m/s2`);

        
        test += e.acceleration.y
        console.log(test)
        camera.rotation.y = test
    }


    useEffect(() => {
        window.addEventListener('devicemotion', deviceMotion)
        return () => window.removeEventListener('devicemotion', deviceMotion)
    }, [])
}