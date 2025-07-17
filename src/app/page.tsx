import Image from "next/image";
import Link  from "next/link"; 
export default function Home() {
  return (
    <>
      <div className="text-center mt-10 text-4xl ">Welcome</div>
      <h3>You can Login From Heare </h3>
      <Link href="/api/auth/signin" className="text-blue-500 underline">
        Go to Sign-In Page
      </Link>
    </>
  );
}
