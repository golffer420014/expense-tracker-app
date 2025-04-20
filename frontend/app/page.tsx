// import { redirect } from "next/navigation"

// export default function Home() {
//   redirect("/dashboard")
// }


"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Lock, User,IdCard } from "lucide-react"
import { showToast } from "@/lib/utils/toast"

export default function AuthTabs() {
  const [showPassword, setShowPassword] = useState(false)
  const [formLogin, setFormLogin] = useState({
    username: "",
    password: "",
  })
  const [formRegister, setFormRegister] = useState({
    username: "",
    password: "",
    name: "",
    confirmPassword: "",
  })

  const handleChangeLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormLogin({ ...formLogin, [e.target.name]: e.target.value })
  }

  const handleChangeRegister = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormRegister({ ...formRegister, [e.target.name]: e.target.value })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }


  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    showToast.success("Login successful")
  }

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(formRegister)
    if (formRegister.password !== formRegister.confirmPassword) {
      showToast.error("Password and confirm password do not match")
      return
    }
    
    showToast.success("Register successful")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
          <CardDescription className="text-center">Sign in to your account or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 gap-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="min-h-[320px]">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="username" name="username" placeholder="username" type="text" className="pl-10" required onChange={handleChangeLogin} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="password" name="password" type={showPassword ? "text" : "password"} className="pl-10 pr-10" required onChange={handleChangeLogin} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-8 w-8"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="username" name="username" placeholder="username" className="pl-10" required onChange={handleChangeRegister} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="name"
                        type="text"
                        className="pl-10"
                        required
                        onChange={handleChangeRegister}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        required
                        onChange={handleChangeRegister}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-8 w-8"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        required
                        onChange={handleChangeRegister}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-8 w-8"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff  /> : <Eye  />}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Register
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">continue with thrid party coming soon..</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* <Button variant="outline">Google</Button> */}
            {/* <Button variant="outline">Facebook</Button> */}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
