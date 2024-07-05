import { SoundManager } from "./SoundManager";
import { useFramesStore } from "./store";

export const Overlay = () => {
    const {
        hoverId,
        focusId,
    } = useFramesStore((s) => s);

    return (
        <>
            <div className="radio_wrapper">
                <p>Now playing {hoverId}</p>
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