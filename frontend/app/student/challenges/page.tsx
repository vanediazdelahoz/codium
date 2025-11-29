"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import Link from "next/link"

interface Challenge {
  id: number
  name: string
  course: string
  deadline: string
  difficulty: "Fácil" | "Medio" | "Difícil"
}

export default function StudentChallengesPage() {
  const challenges: Challenge[] = [
    {
      id: 1,
      name: "Implementar Lista Enlazada",
      course: "Estructuras de Datos",
      deadline: "2024-06-15",
      difficulty: "Medio",
    },
    {
      id: 2,
      name: "Ordenamiento Quicksort",
      course: "Algoritmos Avanzados",
      deadline: "2024-06-20",
      difficulty: "Difícil",
    },
    {
      id: 3,
      name: "Herencia y Polimorfismo",
      course: "Programación Orientada a Objetos",
      deadline: "2024-06-18",
      difficulty: "Fácil",
    },
    {
      id: 4,
      name: "Árbol Binario de Búsqueda",
      course: "Estructuras de Datos",
      deadline: "2024-06-25",
      difficulty: "Medio",
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-500/10 text-green-700 border-green-500/20"
      case "Medio":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
      case "Difícil":
        return "bg-red-500/10 text-red-700 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Retos Disponibles</h1>
        <p className="text-muted-foreground">Resuelve los retos de tus cursos inscritos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <Link key={challenge.id} href={`/student/challenges/${challenge.id}`}>
            <Card className="p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold text-foreground flex-1">{challenge.name}</h3>
                <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium text-foreground">{challenge.course}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Fecha límite: {new Date(challenge.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
