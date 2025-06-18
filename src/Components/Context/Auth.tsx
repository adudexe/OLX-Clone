import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";


export interface AuthContextType {
    user:User | null;
    signUp:(email:string ,password:string) => Promise<any>;
    logIn:(email:string,password:string) => Promise<any>;
    logOut: () => Promise<void>;
}

interface AuthProviderProps {
    children:ReactNode
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// const userAuth = () => useContext(AuthContext);


export const AuthProvider = ({children}:AuthProviderProps) => {
    const [user,setUser] = useState<User | null>(null); 
    
        useEffect(()=>{
            const unsubscribe = onAuthStateChanged(auth,(currentUser:(User | null))=>{
                setUser(currentUser);
            })
    
            return () => unsubscribe();
        },[]);
    
        
        function signUp(email:string,password:string) {
            return createUserWithEmailAndPassword(auth,email,password);
        }
      
        function logIn(email:string,password:string){
            return signInWithEmailAndPassword(auth,email,password);
        }
    
        function logOut(){
            return signOut(auth);
        }
      
      
        return (
            <AuthContext.Provider value={{user,signUp,logIn,logOut}}>
                {children}
            </AuthContext.Provider>
        )
}
