import type { ReactNode } from 'react';
import { userAuth } from './context';
import { Navigate,  } from 'react-router-dom';

const Protected:React.FC<{children:ReactNode}> = ({children}) => {

    const { user } = userAuth();
    
    if(!user){
        return <Navigate to="/login"/>
    }

    return children
}


export default Protected