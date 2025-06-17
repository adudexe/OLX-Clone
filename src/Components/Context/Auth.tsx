import { onAuthStateChanged } from "firebase/auth";
import { Children, createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "../firebase/firebase";

interface node {
    children:ReactNode;
}


const AuthContext = createContext<any | null>(null);

export const userAuth = () => useContext(AuthContext);


export const AuthProvider = ({children}:node) => {
    const [user,setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth , (currUser)=>{
            setUser(currUser); 
        });
        return unsubscribe();
    },[]);

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    )

}
