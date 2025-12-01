"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Loader2 } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"

interface Evaluation {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  status: "DRAFT" | "PUBLISHED" | "CLOSED"
}

export default function StudentEvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadEvaluations()
  }, [])

  const loadEvaluations = async () => {
    setIsLoading(true)
    try {
      const data = await apiClient.evaluationsApi.list()
      // Filtrar solo las evaluaciones publicadas
      const published = (data || []).filter((e: any) => e.status === "PUBLISHED")
      setEvaluations(published)
    } catch (err) {
      console.error("Error loading evaluations:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-500/10 text-green-700 border-green-500/20"
        return "bg-green-500/10 text-green-700 border-green-500/20"
      case "DRAFT":
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
      case "CLOSED":
        return "bg-red-500/10 text-red-700 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "Disponible"
      case "DRAFT":
        return "Programada"
      case "CLOSED":
        return "Cerrado"
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Evaluaciones Formales / Parciales</h1>
        <p className="text-muted-foreground">Accede a tus evaluaciones programadas</p>
      </div>

      {evaluations.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No hay evaluaciones disponibles todavía</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {evaluations.map((evaluation: any) => (
            <Link
              key={evaluation.id}
              href={`/student/evaluations/${evaluation.id}`}
              className={evaluation.status === "CLOSED" ? "pointer-events-none opacity-60" : ""}
            >
              <Card className="p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-foreground flex-1">{evaluation.name}</h3>
                  <Badge className={getStatusColor(evaluation.status)}>{getStatusLabel(evaluation.status)}</Badge>
                </div>

                <div className="space-y-3 flex-1">
                  {evaluation.description && (
                    <div className="text-sm">
                      <p className="text-muted-foreground">{evaluation.description}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <div>
                      <p className="font-medium text-foreground">Apertura</p>
                      <p>{new Date(evaluation.startDate).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <div>
                      <p className="font-medium text-foreground">Cierre</p>
                      <p>{new Date(evaluation.endDate).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
