import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'

import Input from './Components/Login/Input'
import User from './Components/Profile/User'

import 'react-indiana-drag-scroll/dist/style.css'
import './Static/css_styles/style.css'

import { getUserFullInfo } from './Functions/getUserFullInfo.js'

const router = createBrowserRouter([
  {
    path: '/spa-vk-familiars/',
    element: <Input/>,
  },
  {
    path: '/spa-vk-familiars/:id',
    element: <User/>,
    loader: getUserFullInfo
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)