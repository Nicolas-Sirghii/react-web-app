// import { useEffect } from 'react';
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home/Home'
import { Register } from './pages/Login_register/Register'
import { Login } from './pages/Login_register/Login'
import { ForgotPassword } from './pages/Login_register/ResetPassword'
import { Header } from './pages/Header/Header'
import { Message } from './pages/message/Message'

function App() {
  
  return (
    <div>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path='/register' element={<Register />} />
         <Route path='/login' element={<Login />} />
         <Route path='/forgot-password' element={<ForgotPassword />} />
         <Route path='/message' element={<Message />} />
      </Routes>
    </div>
  )
}

export default App
