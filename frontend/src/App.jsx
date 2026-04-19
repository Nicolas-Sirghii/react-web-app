// import { useEffect } from 'react';
import './App.css'

import { Routes, Route } from 'react-router-dom'
import { Header } from './elements/Header'
import { Home } from './pages/Home/Home'
import { Register } from './authUserPages/Register'
import { Login } from './authUserPages/Login'
import { ForgotPassword } from './authUserPages/ForgotPassword'
import { RecoverPassword } from './authUserPages/RecoverPasswrod'
import { VerifyEmail } from './authUserPages/VerifyEmail'

import { Profile } from './pages/userData/Profile'

import { FeedPage } from './pages/FeedPage/FeedPage'



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
        
      </Routes>
    </div>
  )
}

export default App
