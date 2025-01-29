"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../@/components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../@/components/ui/input";
import { Textarea } from "../../../@/components/ui/textarea";
import { chatSession } from "../../../utils/GeminiAIModel"
import { LoaderCircle } from "lucide-react";
import { db } from "../../../utils/db";
import { MockInterview } from "../../../utils/schema";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "@clerk/nextjs";
import moment from 'moment';
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState();
  const router=useRouter();
  const {user} = useUser();

  const onSubmit =async(e)=>{
      setLoading(true);
      e.preventDefault();
      console.log(jobPosition,jobDesc,jobExperience);

      const InputPrompt = "Job Position:"+jobPosition+", Job Description: "+jobDesc+", Nodejs, Year of Experience:"+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+", Depending on this information give me 5 interview questions with 3 to 5 line answers in Json Format, Give Question and answered as field in JSON."
      const result = await chatSession.sendMessage(InputPrompt);
      const MockJsonResp = (result.response.text()).replace('```json','').replace('```','');
      console.log(JSON.parse(MockJsonResp));
      setJsonResponse(MockJsonResp);    

      if(MockJsonResp)
      {
          const resp = await db.insert(MockInterview)
          .values({
            mockId:uuidv4(),
            jsonMockResp:MockJsonResp,
            jobPosition:jobPosition,
            jobDesc:jobDesc,
            jobExperience:jobExperience,
            createdBy:user?.primaryEmailAddress?.emailAddress,
            createdAt:moment().format('DD-MM-yyyy')
          }).returning({mockId:MockInterview.mockId});
          
          console.log("Inserted ID:",resp);

          if(resp){
            setOpenDialog(false);
            router.push('/dashboard/interview/'+resp[0]?.mockId)
          }
      }else{
          console.log("Error");
      }
    setLoading(false);
  }
  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg" open={openDialog}>
        <DialogContent className="flex flex-col max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xm font-bold text-start text-2xl">
              Tell us more about your job interviewing
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground text-start mt-2">
              <form onSubmit={onSubmit}>
                  <div>
                    <h2 >Add details about job position/role, Job description and year of experience</h2>
                    <div className="mt-7 my-3">
                      <label>Job Role/Job Position</label>
                      <Input placeholder="Ex. Full Stack Developer" required 
                      onChange={(event)=>setJobPosition(event.target.value)}/>
                    </div>
                    <div className="my-3">
                      <label>Job Description/Tech Stack (in short)</label>
                      <Textarea placeholder="Ex. React, Angular, Nodejs, MySQL etc" required
                      onChange={(event)=>setJobDesc(event.target.value)}/>
                    </div>
                    <div className="my-3">
                      <label>Year of Experience</label>
                      <Input placeholder="Ex.5" type="number" max="50" required
                      onChange={(event)=>setJobExperience(event.target.value)}/>
                    </div>
                  </div>
                  <div className="flex gap-5 justify-end">
                    <Button type="button" variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
                    <Button type="submit" disabled={loading}>
                      {loading?
                          <>
                          <LoaderCircle className="animate-spin"/>Generating From AI
                          </>:"Start Interview"
                      }
                    </Button>
                  </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
