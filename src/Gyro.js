import { useFrame, useThree } from "@react-three/fiber"
import { easing } from "maath"
import { cubic } from "maath/easing"
import { useEffect } from "react"
import { Euler, Quaternion } from "three"

export const Gyro = () => {

    const camera = useThree((state) => state.camera)
    let test = 0
    let lla = 0
    let previous = 0;

    const deviceMotion = (e) => {
        // test = +(e.alpha).toFixed(3)
        // console.log(test)
        // if(test != test) lla = (test * Math.PI) / 180


        const alpha = (e.beta * Math.PI) / 180;
        const beta = (e.beta * Math.PI) / 180;
        const gamma = (e.gamma * Math.PI) / 180;

        var euler = new Euler(beta, gamma, alpha, "XYZ"); // ' is the order of rotations
        var quaternion = new Quaternion();
        quaternion.setFromEuler(euler);
        camera.setRotationFromQuaternion(quaternion);
    }

    useFrame((state, dt) => {
        // easing.damp3(state.camera.rotation, [0, lla, 0], 0.1, dt)
        // console.log(state.camera.rotation.y)
    })


    useEffect(() => {
        window.addEventListener('deviceorientation', deviceMotion)
        return () => window.removeEventListener('deviceorientation', deviceMotion)
    }, [])
}