"use client"

import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";

export default function Home() {

  const router=useRouter();
  const onDashboard =()=>{
    router.push('/dashboard')
  }
  return (
    <div className="flex h-screen justify-center items-center">
      <div>
        <Button onClick={onDashboard}>Let's Start</Button>
      </div>
    </div>
  );
}
