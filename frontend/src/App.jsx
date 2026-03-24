// import { useEffect } from 'react';
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home/Home'
import { Register } from './pages/Register/Register'
import { Login } from './pages/Login/Login'

function App() {

  return (
    <div>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/register' element={<Register />} />
         <Route path='/login' element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
