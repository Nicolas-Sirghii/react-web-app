// import { useEffect } from 'react';
import './App.css'

import { Routes, Route, data } from 'react-router-dom'
import { Header } from './elements/Header'
import { Home } from './pages/Home/Home'
import { Register } from './authUserPages/Register'
import { Login } from './authUserPages/Login'
import { ForgotPassword } from './authUserPages/ForgotPassword'
import { RecoverPassword } from './authUserPages/RecoverPasswrod'
import { VerifyEmail } from './authUserPages/VerifyEmail'

import { Profile } from './pages/userData/Profile'

import { FeedPage } from './pages/FeedPage/FeedPage'
import { ImageCanvasEditor } from './elements/canvasCard/CanvasCard'
import { ImageCanvasRenderer } from './elements/canvasCard/RenderCanvas'

const data2 = {
  "image": "blob:http://localhost:5173/b3bfadfa-39bd-4ed5-aba5-34275b6f168c",
  "ratio": 1.9768211920529801,
  "rects": [
    {
      "id": 1776889230719.8955,
      "x": 0,
      "y": 0,
      "width": 16.650624988423274,
      "height": 27.01786907335505,
      "field1": "",
      "field2": ""
    },
    {
      "id": 1776889237475.754,
      "x": 16.554381537717294,
      "y": 24.02118021747438,
      "width": 26.275265393147688,
      "height": 24.163858085321117,
      "field1": "",
      "field2": ""
    }
  ]
}

function App() {
  
  return (
    <div>
      <Header />
      <Routes>
         <Route index                           element={<Home />} />
         <Route path='/register'                element={<Register />} />
         <Route path='/login'                   element={<Login />} />
         <Route path='/forgot-password'         element={<ForgotPassword />} />
         <Route path='/verify-email'            element={<VerifyEmail/>} />
         <Route path='/forgot-password'         element={<ForgotPassword />} />
         <Route path='/recover-password'        element={<RecoverPassword />} />
         

         <Route path='/profile'                 element={<Profile />} />
         <Route path='/feed'                    element={<FeedPage />} />
         <Route path='/cover'                   element={<ImageCanvasEditor />} />
         <Route path='/render'                  element={<ImageCanvasRenderer data={data2}/>} />
        
      </Routes>
    </div>
  )
}

export default App
