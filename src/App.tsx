import { Route , Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import Home from "./Pages/Home"
import { AuthProvider } from "./Components/Context/Auth"
import { ItemsContextProvider } from "./Components/Context/Item";
import Details from "./Components/Details/Details";
import Protected from "./Components/Context/Protected";
import  {Profile}  from "./Pages/Profile";


function App() {
  return (
    <>
      <AuthProvider>
        <ItemsContextProvider>
          <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/details" element={<Details/>} />
          <Route path="/profile/" element={
            <Protected>
              <Profile/>
            </Protected>
            } />
          </Routes>
        </ItemsContextProvider>
      </AuthProvider> 
      
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        theme="dark"
        draggable 
        pauseOnHover 
      />
    </>
  )
}

export default App
