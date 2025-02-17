import SignupForm from "@/components/signup-form"

export default function Signup() {
  return (
    <div className="dark:bg-gray-800 flex flex-col justify-center items-center h-screen">
      <h1 className="font-bold font-sans text-5xl basis-1/6">Join Us at CoMMS</h1>
      <SignupForm />
    </div>
  )
}
