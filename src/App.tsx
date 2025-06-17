import { Route , Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import SignUp from "./SignUp"
import Home from "./Pages/Home"
import { AuthProvider } from "./Components/Context/Auth"

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
        <Route path="/signup" element={
          <SignUp/>
        } />
        <Route path="/" element={
          <Home/>
        } />
        </Routes>
      </AuthProvider> 
      
      <ToastContainer />

    </>
  )
}

export default App
