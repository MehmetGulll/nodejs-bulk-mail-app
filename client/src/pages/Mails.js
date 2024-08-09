import React,{useState, useEffect} from 'react';
import axios from 'axios';

function Mails(){
    const [emails, setEmails] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [category, setCategory] = useState('');

    useEffect(()=>{
        const getEmails = async()=>{
            const response = await axios.get("http://localhost:8000/getEmails");
            console.log(response.data);
        }
    })


    return(
        <div></div>
    )
}

export default Mails;