"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Frontend only - simulate login
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-md space-y-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </Link>

        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-4 text-center pb-8">
            <div className="flex justify-center">
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <div className="absolute inset-0 rounded-2xl bg-primary opacity-20 blur-sm" />
                <div className="relative">
                  <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8 3L4 7L8 11M16 3L20 7L16 11M12 4V20M4 13L8 17L4 21M20 13L16 17L20 21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary-foreground"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold">Iniciar Sesión</CardTitle>
              <CardDescription className="text-base">Ingresa tus credenciales para continuar</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <Button type="submit" className="w-full h-11 text-base font-semibold">
                Iniciar Sesión
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">o</span>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                ¿No tienes cuenta?{" "}
                <Link href="/register" className="text-primary hover:underline font-semibold">
                  Crea una aquí
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
