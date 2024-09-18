import React,{createContext, useState} from 'react';

export const EmailContext = createContext();

export const EmailProvider = ({children})=>{
    const [emails, setEmails] = useState([]);
    return(
        <EmailContext.Provider value={{emails,setEmails}}>
            {children}
        </EmailContext.Provider>
    )
}