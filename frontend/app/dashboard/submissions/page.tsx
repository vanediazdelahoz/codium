"use client"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, FileText, ChevronRight, Clock } from "lucide-react"

// Mock data for submissions
const submissionItems = [
  {
    id: 1,
    title: "Ordenamiento de Arrays",
    type: "Reto",
    totalSubmissions: 45,
    lastUpdate: "2025-01-20",
  },
  {
    id: 2,
    title: "Algoritmos de Búsqueda",
    type: "Reto",
    totalSubmissions: 32,
    lastUpdate: "2025-01-19",
  },
  {
    id: 3,
    title: "Parcial 1 - Fundamentos",
    type: "Parcial",
    totalSubmissions: 28,
    lastUpdate: "2025-01-18",
  },
  {
    id: 4,
    title: "Estructuras de Datos",
    type: "Reto",
    totalSubmissions: 51,
    lastUpdate: "2025-01-17",
  },
  {
    id: 5,
    title: "Parcial 2 - Algoritmos Avanzados",
    type: "Parcial",
    totalSubmissions: 24,
    lastUpdate: "2025-01-16",
  },
]

export default function SubmissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Submissions</h1>
        <p className="text-muted-foreground mt-2">Revisa todos los envíos realizados por los estudiantes</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {submissionItems.map((item) => (
          <Link key={item.id} href={`/dashboard/submissions/${item.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 text-balance">{item.title}</CardTitle>
                    <Badge variant={item.type === "Reto" ? "default" : "secondary"}>
                      {item.type === "Reto" ? (
                        <Target className="h-3 w-3 mr-1" />
                      ) : (
                        <FileText className="h-3 w-3 mr-1" />
                      )}
                      {item.type}
                    </Badge>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total de envíos:</span>
                    <span className="font-semibold">{item.totalSubmissions}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Actualizado: {item.lastUpdate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
