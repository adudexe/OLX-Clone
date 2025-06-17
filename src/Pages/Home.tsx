import { useState } from "react"
import { Navbar } from "../Components/Navbar/Navbar"
import Login from "../Components/Modal/Login";
import { Sell } from "../Components/Modal/Sell";
const Home = () => {

  const [openModal, setModal] = useState<boolean>(false);
  const [openSellModal ,setSellModal] = useState<boolean>(false);

  const toggleModal = () => {
    setModal(!openModal);
  }

  const toggleSellModal = () => {
    setSellModal(!openSellModal);
  }
  
  
  
  return (
    <div>
      <Navbar toggleModal={toggleModal} toggleSellModal={toggleSellModal} />
      <Login toggleModal={toggleModal} status={openModal} />
      <Sell toggleSellModal={toggleSellModal} status={openSellModal}/>
    </div>
  )
}

export default Home