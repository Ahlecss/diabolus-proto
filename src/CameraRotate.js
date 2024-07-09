import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { cubic } from "maath/easing";
import { useEffect, useRef } from "react";
import { useFramesStore } from "./store";
import { useShallow } from "zustand/react/shallow";

export const CameraRotate = () => {
    var dtScroll = useRef(0);

    const onRotate = (e) => {
        // console.log(e);
        dtScroll.current += Math.PI * 2 * (e.deltaY / 10000)
        // console.log(dtScroll.current);
    }

    const { framesRef, focusId } = useFramesStore(
        useShallow((state) => ({ framesRef: state.framesRef, focusId: state.focusId })),
    )

    useEffect(() => {
        if (focusId === null) {
            document.addEventListener('wheel', onRotate)
        } else {
            document.removeEventListener('wheel', onRotate)
            setTimeout(() => {
                console.log(focusId)
                // if(focusId) dtScroll.current = - 2 * Math.PI * ((focusId + 1) / 8)
                //   console.log(dtScroll.current)
            }, 1000)
        }
        return () => {
            document.removeEventListener('wheel', onRotate)
            // dtScroll.current = 0
        }
    })

    useFrame((state, dt) => {
        // console.log(scroll.offset)
        if(framesRef.current) easing.dampE(framesRef.current.rotation, [0, dtScroll.current, 0], cubic.inOut(0.4), dt)
    })
}