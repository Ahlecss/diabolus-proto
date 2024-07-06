import { useEffect, useState } from "react";
import { SoundManager } from "./SoundManager";
import { useFramesStore } from "./store";
import { vitrauxData } from "./vitrauxData";
import { useShallow } from "zustand/react/shallow";

export const Overlay = () => {

    const { hoverId, focusId, invisible, setInvisible } = useFramesStore(
        useShallow((state) => ({ hoverId: state.hoverId, focusId: state.focusId, invisible: state.invisible, setInvisible: state.setInvisible })),
    )

    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        console.log(hoverId, focusId)
        if (hoverId !== null) {
            console.log(hoverId)
            setIsActive(hoverId)
        }
        else if (focusId !== null) {
            console.log(focusId)
            setIsActive(focusId)
        }
        else setIsActive(undefined)
    }, [hoverId, focusId])
    return (
        <>
            <div className={`radio_wrapper`}>
                {vitrauxData[isActive] &&
                    <p>Now playing {vitrauxData[isActive]?.musicTitle}</p>
                }
            </div>
            <div className={`cartel_wrapper ${focusId !== null ? 'cartel_active' : ''}`}>
                <button className={`cartel_button ${focusId !== null ? 'button_active' : ''} ${invisible ? 'button_focus' : ''} `} onClick={(e) => (e.stopPropagation(), console.log('tets'), setInvisible(!invisible))}>Discover references</button>
            </div>
            <SoundManager />
        </>
    )
    return (
        <div className={`cartel_wrapper ${isActive ? 'cartel_active' : ''}`}>
            <h1 className='cartel_title'>{props.genre}</h1>
            <p className='cartel_description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <buttton className={`cartel_button ${isActive ? 'button_active' : ''}`} onClick={(e) => (e.stopPropagation(), invisible.current = !invisible.current)}>Discover references</buttton>
            {/* <p className={`radio ${(hovered || isActive) ? 'radio_active' : ''}`}>Now playing {props.genre}</p> */}
        </div>
    )
}