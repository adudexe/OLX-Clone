import { useEffect, useState } from "react";
import { Navbar } from "../Components/Navbar/Navbar";
import Login from "../Components/Modal/Login";
import { Sell } from "../Components/Modal/Sell";
import Card from "../Components/Card/Card";
import { useItemsContext } from "../Components/Context/Item";
import { fetchFromFirestore } from "../Components/firebase/firebase";
import { toast } from "react-toastify";

const Home = () => {
  const [openModal, setModal] = useState<boolean>(false);
  const [openSellModal, setSellModal] = useState<boolean>(false);

  const toggleModal = () => setModal((prev) => !prev);
  const toggleSellModal = () => setSellModal((prev) => !prev);

  const itemsCtx = useItemsContext();

  console.log(itemsCtx);

  useEffect(() => {
    try{
      const getItems = async () => {
      const datas = await fetchFromFirestore();
      console.log("Data from Home Page",datas);
      if (datas) {
        itemsCtx.setItems(datas || []);
      }
      getItems();
    }; 
    } catch(err){
      console.log("Error in Fetching data",err);
      toast.error("Error in Fetching");
      return ;
    }
  },[]);

  useEffect(() => {
    console.log("The items are", itemsCtx.items);
  }, [itemsCtx.items]);

  return (
    <div>
      <Navbar toggleModal={toggleModal} toggleSellModal={toggleSellModal} />
      <Login toggleModal={toggleModal} status={openModal} />
      <Sell
        setItems={itemsCtx.setItems}
        toggleSellModal={toggleSellModal}
        status={openSellModal}
      />

      {itemsCtx.items.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading products...</p>
      ) : (
        <Card items={itemsCtx.items} />
      )}
    </div>
  );
};

export default Home;
