import LoginForm from "@/components/login-form"

export default function Login() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="font-bold font-sans text-5xl basis-1/6">Login</h1>
      <LoginForm />
    </div>
  )
}