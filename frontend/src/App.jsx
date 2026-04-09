// import { useEffect } from 'react';
import './App.css'

import { Routes, Route } from 'react-router-dom'
import { Header } from './elements/Header'
import { Home } from './pages/Home/Home'
import { Register } from './authUserPages/Register'
import { Login } from './authUserPages/Login'
import { IsAuthorizedPage } from './authUserPages/IsAuthorized'
import { ForgotPassword } from './authUserPages/ForgotPassword'
import { RecoverPassword } from './authUserPages/RecoverPasswrod'
import { SendVerificationEmail } from './authUserPages/SendVerificationEmail'
import { VerifyEmail } from './authUserPages/VerifyEmail'



import { CountdownTimer } from './assets/CountDown'

import { Profile } from './pages/profile/Profile'


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
         <Route path='/send-verification-email' element={<SendVerificationEmail />} />
         <Route path='/is-authorized'           element={<IsAuthorizedPage />} />
         <Route path='/count'           element={<CountdownTimer />} />

         <Route path='/profile'           element={<Profile />} />
      </Routes>
    </div>
  )
}

export default App
