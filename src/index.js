import { createRoot } from 'react-dom/client'
import './styles.css'
import { App } from './App'

import black from './images/VitrailSimple_BLACKMETAL.png'
import hardcore from './images/VitrailSimple_HARDCORE.png'
import death from './images/VitrailSimple_DEATHMETAL.png'

import blackLegendes from './images/VitrailSimple_BLACKMETAL_Legendes.jpg'
import hardcoreLegendes from './images/VitrailSimple_HARDCORE_Legendes.jpg'
import deathLegendes from './images/VitrailSimple_DEATHMETAL_Legendes.jpg'

import SpiritCrusher from './sounds/SpiritCrusher.mp3'
import HornetsNest from './sounds/HornetsNest.mp3'
import FreezingMoon from './sounds/FreezingMoon.mp3'

const pexel = (id) => `${id}`
// const pexel = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`

const vitraux = [
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

createRoot(document.getElementById('root')).render(<App vitraux={vitraux} />)
