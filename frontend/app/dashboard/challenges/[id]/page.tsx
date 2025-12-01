"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Pencil, Clock, Target } from "lucide-react"

export default function ChallengeDetailPage() {
  const challenge = {
    title: "Algoritmo de Ordenamiento",
    description:
      "Implementa un algoritmo de ordenamiento eficiente que ordene un array de números enteros en orden ascendente. El algoritmo debe tener una complejidad temporal mejor que O(n²) en el caso promedio.",
    difficulty: "Medio",
    tags: ["Algoritmos", "Ordenamiento", "Arrays"],
    courses: ["12345 - Programación Avanzada", "12346 - Estructuras de Datos"],
    timeLimit: "60 minutos",
    status: "Publicado",
    testCases: [
      { name: "Caso básico", input: "[3, 1, 4, 1, 5]", expectedOutput: "[1, 1, 3, 4, 5]" },
      { name: "Array vacío", input: "[]", expectedOutput: "[]" },
      { name: "Array ordenado", input: "[1, 2, 3, 4, 5]", expectedOutput: "[1, 2, 3, 4, 5]" },
    ],
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Medio":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Difícil":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/challenges">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-balance">{challenge.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                {challenge.difficulty}
              </Badge>
              <Badge variant="outline">{challenge.status}</Badge>
            </div>
          </div>
        </div>
        <Link href="/dashboard/challenges/1/edit">
          <Button>
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{challenge.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Casos de Prueba</CardTitle>
              <CardDescription>Casos definidos para validar las soluciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {challenge.testCases.map((testCase, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base">{testCase.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Entrada:</p>
                      <code className="block p-3 bg-muted rounded-md text-sm">{testCase.input}</code>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Resultado Esperado:</p>
                      <code className="block p-3 bg-muted rounded-md text-sm">{testCase.expectedOutput}</code>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Límite de tiempo</p>
                  <p className="text-sm text-muted-foreground">{challenge.timeLimit}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Dificultad</p>
                  <p className="text-sm text-muted-foreground">{challenge.difficulty}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {challenge.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cursos Asignados</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {challenge.courses.map((course) => (
                  <li key={course} className="text-sm text-muted-foreground">
                    {course}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
