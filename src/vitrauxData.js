import black from './images/VitrailSimple_BLACKMETAL.webp'
import hardcore from './images/VitrailSimple_HARDCORE.webp'
import death from './images/VitrailSimple_DEATHMETAL.png'
import thrash from './images/VitrailTriple_THRASHMETAL.webp'

import blackLegendes from './images/VitrailSimple_BLACKMETAL_Legendes.jpg'
import hardcoreLegendes from './images/VitrailSimple_HARDCORE_Legendes.jpg'
import deathLegendes from './images/VitrailSimple_DEATHMETAL_Legendes.jpg'
import thrashLegendes from './images/VitrailTriple_THRASHMETAL_Legendes.webp'

import SpiritCrusher from './sounds/SpiritCrusher.mp3'
import HornetsNest from './sounds/HornetsNest.mp3'
import FreezingMoon from './sounds/FreezingMoon.mp3'

export const vitrauxData = [
    { url: '0', texture1: black, texture2: blackLegendes, type: 'simple', idd: 0, length: 8, genre: 'Black Metal', music: FreezingMoon, musicTitle: "Mayhem - Freezing Moon" },

    { url: '2', texture1: thrash, texture2: thrashLegendes, type: 'triple', ratios: { x: 0, z: 1 }, idd: 2, length: 8, genre: 'Hardcore', music: HornetsNest, musicTitle: "Power Trip - Hornet's Nest" },

    { url: '4', texture1: death, texture2: deathLegendes, type: 'simple', idd: 4, length: 8, genre: 'Death Metal', music: SpiritCrusher, musicTitle: "Death - Spirit Crusher" },

    { url: '6', texture1: thrash, texture2: thrashLegendes, type: 'triple', ratios: { x: 1, z: 0 }, idd: 6, length: 8, genre: 'Trash Metal', music: FreezingMoon, musicTitle: "Mayhem - Freezing Moon" },

    { url: '8', texture1: hardcore, texture2: hardcoreLegendes, type: 'simple', idd: 8, length: 8, genre: 'Hardcore', music: HornetsNest, musicTitle: "Power Trip - Hornet's Nest" },

    { url: '10', texture1: thrash, texture2: thrashLegendes, type: 'triple', ratios: { x: 0, z: -1 }, idd: 10, length: 8, genre: 'Death Metal', music: SpiritCrusher, musicTitle: "Death - Spirit Crusher" },

    { url: '12', texture1: hardcore, texture2: hardcoreLegendes, type: 'simple', idd: 12, length: 8, genre: 'Hardcore', music: HornetsNest, musicTitle: "Power Trip - Hornet's Nest" },

    { url: '14', texture1: thrash, texture2: thrashLegendes, type: 'triple', ratios: { x: -1, z: 0 }, idd: 14, genre: 'Death Metal', music: SpiritCrusher, musicTitle: "Death - Spirit Crusher" },
]