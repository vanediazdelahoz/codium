"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import Link from "next/link"

interface Evaluation {
  id: number
  name: string
  course: string
  openDate: string
  closeDate: string
  status: "Disponible" | "Cerrado" | "Próximo"
  challengeCount: number
}

export default function StudentEvaluationsPage() {
  const evaluations: Evaluation[] = [
    {
      id: 1,
      name: "Parcial 1 - Listas y Pilas",
      course: "Estructuras de Datos",
      openDate: "2024-06-10T09:00:00",
      closeDate: "2024-06-10T11:00:00",
      status: "Disponible",
      challengeCount: 3,
    },
    {
      id: 2,
      name: "Examen Final - Algoritmos",
      course: "Algoritmos Avanzados",
      openDate: "2024-06-20T14:00:00",
      closeDate: "2024-06-20T17:00:00",
      status: "Próximo",
      challengeCount: 5,
    },
    {
      id: 3,
      name: "Parcial 2 - POO Avanzado",
      course: "Programación Orientada a Objetos",
      openDate: "2024-05-15T10:00:00",
      closeDate: "2024-05-15T12:00:00",
      status: "Cerrado",
      challengeCount: 4,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponible":
        return "bg-green-500/10 text-green-700 border-green-500/20"
      case "Próximo":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20"
      case "Cerrado":
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Evaluaciones Formales / Parciales</h1>
        <p className="text-muted-foreground">Accede a tus evaluaciones programadas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {evaluations.map((evaluation) => (
          <Link
            key={evaluation.id}
            href={`/student/evaluations/${evaluation.id}`}
            className={evaluation.status === "Cerrado" ? "pointer-events-none opacity-60" : ""}
          >
            <Card className="p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold text-foreground flex-1">{evaluation.name}</h3>
                <Badge className={getStatusColor(evaluation.status)}>{evaluation.status}</Badge>
              </div>

              <div className="space-y-3 flex-1">
                <div className="text-sm">
                  <span className="text-muted-foreground">Curso: </span>
                  <span className="font-medium text-foreground">{evaluation.course}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <div>
                    <p className="font-medium text-foreground">Apertura</p>
                    <p>{new Date(evaluation.openDate).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <div>
                    <p className="font-medium text-foreground">Cierre</p>
                    <p>{new Date(evaluation.closeDate).toLocaleString()}</p>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">Retos incluidos: </span>
                  <span className="font-medium text-foreground">{evaluation.challengeCount}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
