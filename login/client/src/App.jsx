import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import Login from './Login'

import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Song from './components/Song';
import { AuthProvider } from './components/Authcontext';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Signup />}></Route>
            <Route path='/Login' element={<Login />}></Route>
            <Route path='/Song' element={<Song />}></Route>
          </Routes>
        </BrowserRouter>
    </AuthProvider>
      
  )
}

export default App

