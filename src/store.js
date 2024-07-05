import { create } from 'zustand'

export const useFramesStore = create((set) => ({
    hoverId: undefined,
    focusId: undefined,
    changeHoverId: (newId) => set(() => ({ hoverId: newId })),
    changeFocusId: (newId) => set(() => ({ focusId: newId })),
}))
