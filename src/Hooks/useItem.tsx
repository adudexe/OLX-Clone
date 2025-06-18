import { useEffect } from "react";
import { useItemsContext } from "../Components/Context/Item";
import { fetchFromFirestore } from "../Components/firebase/firebase";


export const useItems = () => {
    const itemsCtx = useItemsContext();

    useEffect(()=>{
        const getItems = async () => {
            const data = await fetchFromFirestore();
            if(data){
                itemsCtx.setItems(data);
            }
        };
        getItems();
    },[]);

    return itemsCtx;
}