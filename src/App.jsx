import { Route, Routes } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Routes>
      <Redirect exact from="/" to="/dashboard" />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/profile" element={<Profile />} />      
    </Routes>
  )
}

export default App
