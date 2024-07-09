import { useFrame, useThree } from "@react-three/fiber"
import { easing } from "maath"
import { cubic } from "maath/easing"
import { useEffect } from "react"
import { Euler, Quaternion } from "three"

export const Gyro = (isActive) => {

    const camera = useThree((state) => state.camera)
    let previous = 0;

    const deviceMotion = (e) => {

        const alpha = (e.alpha * Math.PI) / 180;
        // const beta = (e.beta * Math.PI) / 180;
        // const gamma = (e.gamma * Math.PI) / 180;
        // const diff = alpha - previous
        setQuat(alpha)
        // console.log(diff)
        // if (diff > 0.002 || diff < - 0.002) setQuat(alpha)
        // previous = alpha
    }

    const setQuat = (alpha) => {
        var euler = new Euler(0, alpha, 0, "YXZ"); // ' is the order of rotations
        var quaternion = new Quaternion();
        quaternion.setFromEuler(euler);
        camera.setRotationFromQuaternion(quaternion);
    }

    useEffect(() => {
        if (isActive) window.addEventListener('deviceorientation', deviceMotion)
        else window.removeEventListener('deviceorientation', deviceMotion)
        return () => window.removeEventListener('deviceorientation', deviceMotion)
    }, [])
}