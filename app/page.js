import { Button } from "../components/ui/button";
import { Divide, Link } from "lucide-react";

export default function Home() {
  return (
    <div>
      <Link href="./dashboard">
        <Button>Let's Start</Button>
      </Link>
    </div>
  );
}
