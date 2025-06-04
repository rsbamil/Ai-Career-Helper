"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useState } from 'react'

function History() {
    const [userHistory, setUserHistory] = useState([])
  return (
    <div className='mt-5 p-5 border rounded-lg'>
        <h2 className='font-bold text-lg'>
            Previous History
        </h2>
       <p className='text-gray-400'>
        What your Previously work on , You can find here
       </p>
       {userHistory?.length==0 && 
       <div className='flex items-center justify-center mt-5 flex-col mt-6'>
        <Image src={'/idea.png'}  width={50} height={50} alt='bulb'/>
        <h2>You do not have any history</h2>
        <Button className='mt-5'>Explore Ai Tools</Button>
       </div>
       }
    </div>
  )
}

export default History