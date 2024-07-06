import useSound from 'use-sound';
import { vitrauxData } from './vitrauxData';
import { useRef } from 'react';
import { useEffect } from 'react';
import { memo } from 'react';
import { forwardRef } from 'react';
import { useImperativeHandle } from 'react';
import { useFramesStore } from './store';
import { isMobile } from 'react-device-detect';
import { useShallow } from 'zustand/react/shallow';
export const SoundManager = memo(() => {

    const soundsRef = useRef([]);
    const oldId = useRef();

    const { hoverId, focusId, changeFocusId } = useFramesStore(
        useShallow((state) => ({ hoverId: state.hoverId, focusId: state.focusId, changeFocusId: state.changeFocusId })),
    )

    console.log('rerender')

    const playSound = (newId) => {
        if (newId !== null && soundsRef.current[newId]?.sound) {
            // soundsRef.current[newId].isPlaying === true
            soundsRef.current[newId].sound.fade(0, 1, 1000)
            soundsRef.current[newId].play()
        }
        oldId.current = newId
    }
    const stopSound = (oldId) => {
        if (soundsRef.current[oldId]?.sound) {
            soundsRef.current[oldId].sound.fade(1, 0, 250)
            // soundsRef.current[oldId].isPlaying = (false)
            setTimeout(() => { soundsRef.current[oldId].stop() }, 250)
        }
    }

    useEffect(() => {
        if (!isMobile) {
            if (focusId !== null) return
            if ((hoverId !== (null))) {
                console.log('playSound')
                playSound(hoverId)
            } else {
                console.log('stopSound')
                stopSound(oldId.current)
            }
        }
    }, [hoverId])

    useEffect(() => {
        if (isMobile) {
            if (focusId !== null) {
                playSound(focusId)
            } else {
                stopSound(oldId.current)
            }
        }
    }, [focusId])


    return (
        vitrauxData.map((vitrail, i) => <SingleSound key={i} i={i} music={vitrail.music} ref={el => soundsRef.current[i] = el} /> /* prettier-ignore */)
    )
})

const SingleSound = memo(forwardRef((props, ref) => {

    const [play, { stop, sound }] = useSound(props.music, {});

    useImperativeHandle(ref, () => ({
        play,
        stop,
        sound
    }));
}))