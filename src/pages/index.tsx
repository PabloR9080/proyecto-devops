import Greeting from '../components/greeting'
import React, {useState, useEffect} from 'react'
import Image from 'next/image'
import pic from 'src/public/images/20687.png'

export default function Home(){
    const [title, setTitle] = useState('Hola mundo anime :3');
    useEffect(() => {
        setTitle("Digital Financier");
    },[])
    return (
        <>
            <Image src={pic} width={100} height={100} alt="boys dont cry" />
            <Greeting title={title} />
        </>
    )
}