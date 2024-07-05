import useSound from 'use-sound';
import { vitrauxData } from './vitrauxData';
import { useRef } from 'react';
import { useEffect } from 'react';
import { memo } from 'react';
import { forwardRef } from 'react';
import { useImperativeHandle } from 'react';
import { useFramesStore } from './store';
export const SoundManager = memo(() => {

    const soundsRef = useRef([]);
    const oldId = useRef();

    const {
        hoverId,
        focusId,
        changeFocusId
    } = useFramesStore((s) => s);

    const playSound = (newId) => {
        if (newId !== null && soundsRef.current[newId]) {
            // soundsRef.current[newId].isPlaying === true
            soundsRef.current[newId].sound.fade(0, 1, 1000)
            soundsRef.current[newId].play()
        }
        oldId.current = newId
    }
    const stopSound = (oldId) => {
        soundsRef.current[oldId].sound.fade(1, 0, 250)
        // soundsRef.current[oldId].isPlaying = (false)
        setTimeout(() => { soundsRef.current[oldId].stop() }, 250)
    }

    useEffect(() => {
        console.log(hoverId)
        if (focusId !== null) return
        if ((hoverId !== (null))) {
            playSound(hoverId)
        } else {
            stopSound(oldId.current)
        }
    }, [hoverId])

    useEffect(() => {
        console.log('focusId')
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