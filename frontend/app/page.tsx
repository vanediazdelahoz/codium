"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2, Users, Trophy, Zap, BookOpen, Award } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Logo y Hero */}
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl">
                <div className="absolute inset-0 rounded-2xl bg-primary opacity-20 blur-md" />
                <div className="relative">
                  <svg viewBox="0 0 24 24" fill="none" className="w-14 h-14" xmlns="http://www.w3.org/2000/svg">
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
            <h1 className="text-5xl font-bold text-balance">
              Bienvenido a <span className="text-primary">Codium</span>
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl">
              La plataforma educativa para aprender programación mediante retos prácticos, evaluaciones automatizadas y
              competencia sana entre estudiantes
            </p>
          </div>

          {/* Botones principales */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button size="lg" className="flex-1 text-lg py-6" onClick={() => router.push("/login")}>
              Iniciar Sesión
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 text-lg py-6 bg-transparent"
              onClick={() => router.push("/register")}
            >
              Crear Cuenta
            </Button>
          </div>

          {/* Características */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-16">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Code2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Retos de Programación</CardTitle>
                <CardDescription>
                  Resuelve retos de código en Python, Java, C++ y Node.js con evaluación automatizada instantánea y
                  retroalimentación detallada
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-4 w-4 text-primary" />
                </div>
                <CardTitle>Evaluaciones Formales</CardTitle>
                <CardDescription>
                  Participa en evaluaciones con límite de tiempo que ponen a prueba tus habilidades de programación en
                  un entorno controlado
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Organización por Cursos</CardTitle>
                <CardDescription>
                  Estructura clara por cursos y grupos donde profesores asignan retos y estudiantes aprenden de forma
                  organizada
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Rankings Competitivos</CardTitle>
                <CardDescription>
                  Compite sanamente con tus compañeros en leaderboards por curso, por reto y por evaluación para
                  impulsar tu aprendizaje
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Retroalimentación Inmediata</CardTitle>
                <CardDescription>
                  Recibe resultados instantáneos de tus soluciones con información detallada de casos de prueba, tiempo
                  de ejecución y errores
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Aprendizaje Estructurado</CardTitle>
                <CardDescription>
                  Progresa a través de retos diseñados por profesores con diferentes niveles de dificultad adaptados a
                  tu curso
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground text-sm">
            &copy; 2025 Codium. Plataforma educativa para el aprendizaje de programación.
          </p>
        </div>
      </div>
    </div>
  )
}
