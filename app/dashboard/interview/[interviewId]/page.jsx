"use client"

import React, { use, useEffect, useState } from 'react';
import { MockInterview } from '../../../../utils/schema';
import { db } from "../../../../utils/db";
import { eq } from "drizzle-orm";
import Webcam from 'react-webcam';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import Link from 'next/link';

function Interview({params}) {

    const unWrappedParams = use(params);
    const [interviewData,setInterviewData] = useState();
    const [webCamEnabled,setWebCamEnabled] = useState(false);

    useEffect(()=>{
        console.log(unWrappedParams.interviewId);
        GetInterviewDetails();
    },[])

    // Used to get the interview details by MockId/Interview Id 

    const GetInterviewDetails = async()=>{
      const result=await db.select().from(MockInterview)
      .where(eq(MockInterview.mockId,unWrappedParams.interviewId));

      setInterviewData(result[0]);
    }
  return (
    <div className='my-5'>
      <h2 className='font-bold text-2xl'>Let's Get Started</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
 
          <div className='flex flex-col my-10 gap-3'>
            <div className='flex flex-col p-5 rounded-lg border'>
                <h2 className='text-md'><strong>Job Role/Job Position:</strong>{interviewData?.jobPosition}</h2>
                <h2 className='text-md'><strong>Job Description/Tech Stack:</strong>{interviewData?.jobDesc}</h2>
                <h2 className='text-md'><strong>Years of Experience:</strong>{interviewData?.jobExperience}</h2>
            </div>
            <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb/><strong>Information</strong></h2>
                <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
            </div>
          </div> 

          <div>
            {webCamEnabled? <Webcam
              onUserMedia={()=>setWebCamEnabled(true)}
              onUserMediaError={()=>setWebCamEnabled(false)}
              mirrored={true}
              style={{
                  height:300,
                  width:300
              }}
              />
              :
              <>
                <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border'/>
                <Button variant="ghost" className='w-full' onClick={()=>setWebCamEnabled(true)}>Enable Web Cam & Microphone </Button>
              </> 
            }
          </div>
      </div>
      <div className='flex justify-end items-end'>
        <Link href={'/dashboard/interview/'+unWrappedParams.mockId+'/start'}>
            <Button> Start Interview </Button>
        </Link>   
      </div>
    </div>
  )
}

export default Interview