// import { useEffect } from 'react';
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home/Home'
import { Register } from './pages/Login_register/Register'
import { Login } from './pages/Login_register/Login'
import { ForgotPassword } from './pages/Login_register/ResetPassword'
import { Header2 } from './pages/Header/Header2'
import { Message } from './pages/message/Message'
import { UserImages } from './pages/getImages/GetImages'
import { VerifyEmail } from './pages/Login_register/VeryfyEmail'
import { UserSettings } from './pages/Header/headerSettings/HeaderSettings'

function App() {
  
  return (
    <div>
      <Header2 />
      <Routes>
        <Route index element={<Home />} />
        <Route path='/register' element={<Register />} />
         <Route path='/login' element={<Login />} />
         <Route path='/forgot-password' element={<ForgotPassword />} />
         <Route path='/message' element={<Message />} />
         <Route path='/userimages' element={<UserImages />} />
         <Route path='/verify-email' element={<VerifyEmail/>} />
         <Route path='/user-settings' element={<UserSettings />} />
      </Routes>
    </div>
  )
}

export default App
