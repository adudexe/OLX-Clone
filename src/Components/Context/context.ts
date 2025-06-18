import { useContext } from "react";
import { AuthContext, type AuthContextType } from "./Auth";


export const userAuth = ():AuthContextType => {
    const user = useContext(AuthContext);
    if(user == undefined){
        throw("The Auth context is missing value's or not properly defined");
    }
    return user; 
}