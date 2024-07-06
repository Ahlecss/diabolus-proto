import { create } from 'zustand'

export const useFramesStore = create((set) => ({
    hoverId: undefined,
    focusId: undefined,
    invisible: false,
    currentGodrays: 0,
    isGodRays: false,
    changeHoverId: (newId) => set(() => ({ hoverId: newId })),
    changeFocusId: (newId) => set(() => ({ focusId: newId })),
    setInvisible: (value) => set(() => ({ invisible: value})),
    handleGodrays: (bool, id) => set(() => ({ currentGodrays: id, isGodRays: boold}))
}))
