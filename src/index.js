import { createRoot } from 'react-dom/client'
import './styles.css'
import { App } from './App'

import { vitrauxData } from './vitrauxData'

const pexel = (id) => `${id}`
// const pexel = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`

createRoot(document.getElementById('root')).render(<App vitraux={vitrauxData} />)
