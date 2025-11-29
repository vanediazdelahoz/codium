"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  })

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // Frontend only - simulate registration
    router.push("/login")
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
              <CardTitle className="text-3xl font-bold">Crear Cuenta</CardTitle>
              <CardDescription className="text-base">Completa el formulario para registrarte</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    placeholder="Juan"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    placeholder="Pérez"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, role: value })} required>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecciona tu rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Estudiante</SelectItem>
                    <SelectItem value="teacher">Profesor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="h-11"
                />
              </div>
              <Button type="submit" className="w-full h-11 text-base font-semibold">
                Crear Cuenta
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
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-primary hover:underline font-semibold">
                  Inicia sesión
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
