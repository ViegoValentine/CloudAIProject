import { useState } from 'react'
import { ToastContainer } from "react-toastify";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from './Components/Home/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <ToastContainer />
      <Home />
    </div>
  )
}

export default App
