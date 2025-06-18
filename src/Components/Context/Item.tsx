import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { collection, getDocs } from "firebase/firestore";
import { fireStore } from "../firebase/firebase";

export interface Item {
  id: string;
  title: string;
  price: string;
  category:string;
  image?:any;
  description?: string;
}

interface ContextType {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

const Context = createContext<ContextType | null>(null);

// Custom hook
export const useItemsContext = () => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("useItemsContext must be used within ItemsContextProvider");
  }
  return ctx;
};

interface ItemsProviderProps {
  children: ReactNode;
}

export const ItemsContextProvider = ({ children }: ItemsProviderProps) => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItemsFromFirestore = async () => {
      try {
        const productsCollection = collection(fireStore, "products");
        const productSnapshot = await getDocs(productsCollection);
        const productsList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Item[]; // Type assertion
        setItems(productsList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchItemsFromFirestore();
  }, []);

  return (
    <Context.Provider value={{ items, setItems }}>
      {children}
    </Context.Provider>
  );
};
