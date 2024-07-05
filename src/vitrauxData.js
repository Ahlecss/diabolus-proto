import black from './images/VitrailSimple_BLACKMETAL.webp'
import hardcore from './images/VitrailSimple_HARDCORE.webp'
import death from './images/VitrailSimple_DEATHMETAL.png'

import blackLegendes from './images/VitrailSimple_BLACKMETAL_Legendes.jpg'
import hardcoreLegendes from './images/VitrailSimple_HARDCORE_Legendes.jpg'
import deathLegendes from './images/VitrailSimple_DEATHMETAL_Legendes.jpg'

import SpiritCrusher from './sounds/SpiritCrusher.mp3'
import HornetsNest from './sounds/HornetsNest.mp3'
import FreezingMoon from './sounds/FreezingMoon.mp3'

export const vitrauxData = [
    // Front
    { position: [0, 0, 1.5 * -4], rotation: [0, 0, 0], url: '0', texture1: black, texture2: blackLegendes, idd: 0, genre: 'Black Metal', music: FreezingMoon },
    // { position: [0, 0, 1.51 * -4], rotation: [0, 0, 0], url: '1', texture: blackLegendes, idd: 1 },
    // Left
    { position: [-9, 0, -3.75], rotation: [0, Math.PI / 2.5, 0], url: '2', texture1: hardcore, texture2: hardcoreLegendes, idd: 2, genre: 'Harcore', music: HornetsNest },
    // { position: [-9.01, 0.01, -3.76], rotation: [0, Math.PI / 2.5, 0], url: '3', texture: hardcoreLegendes, idd: 3 },
    // Right
    { position: [9, 0, -3.75], rotation: [0, -Math.PI / 2.5, 0], url: '4', texture1: death, texture2: deathLegendes, idd: 4, genre: 'Death Metal', music: SpiritCrusher },
    // { position: [9.01, 0.01, -3.76], rotation: [0, -Math.PI / 2.5, 0], url: '5', texture: deathLegendes, idd: 5 }
]