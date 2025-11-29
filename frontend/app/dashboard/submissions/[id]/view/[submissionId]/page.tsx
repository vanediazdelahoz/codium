"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Code2, Calendar, AlertCircle, CheckCircle2 } from "lucide-react"

// Mock data
const submissionDetails = {
  student: "Juan Pérez",
  challenge: "Ordenamiento de Arrays",
  challengeType: "Reto",
  language: "Python 3",
  timestamp: "2025-01-20 14:32:15",
  status: "Accepted",
  executionTime: "245ms",
  memoryUsed: "32.4 MB",
  testCasesPassed: "10/10",
  code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

# Test
print(bubble_sort([64, 34, 25, 12, 22, 11, 90]))
print(quick_sort([64, 34, 25, 12, 22, 11, 90]))`,
  executionOutput: `[11, 12, 22, 25, 34, 64, 90]
[11, 12, 22, 25, 34, 64, 90]
All test cases passed successfully!`,
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Accepted: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    "Wrong Answer": "bg-rose-500/10 text-rose-700 border-rose-500/20",
    Running: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    "Time Limit Exceeded": "bg-amber-500/10 text-amber-700 border-amber-500/20",
    "Runtime Error": "bg-red-500/10 text-red-700 border-red-500/20",
    "Compilation Error": "bg-orange-500/10 text-orange-700 border-orange-500/20",
  }
  return colors[status] || "bg-gray-500/10 text-gray-700 border-gray-500/20"
}

export default function ViewSubmissionPage() {
  const params = useParams()
  const { id, submissionId } = params

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/dashboard/submissions/${id}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Ranking
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-balance">Detalle del Envío</h1>
        <p className="text-muted-foreground mt-2">ID del envío: {submissionId}</p>
      </div>

      {/* Información del Estudiante y Envío */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Estudiante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Estudiante</p>
              <p className="font-semibold">{submissionDetails.student}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resolviendo</p>
              <p className="font-semibold">{submissionDetails.challenge}</p>
              <Badge className="mt-1" variant="outline">
                {submissionDetails.challengeType}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Información Técnica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Lenguaje</p>
              <p className="font-semibold">{submissionDetails.language}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha y Hora
              </p>
              <p className="font-semibold">{submissionDetails.timestamp}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado y Resultados */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Ejecución</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Estado</p>
              <Badge className={getStatusColor(submissionDetails.status)} variant="outline">
                {submissionDetails.status === "Accepted" ? (
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                ) : (
                  <AlertCircle className="h-4 w-4 mr-1" />
                )}
                {submissionDetails.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Tiempo de Ejecución</p>
              <p className="font-semibold">{submissionDetails.executionTime}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Memoria Usada</p>
              <p className="font-semibold">{submissionDetails.memoryUsed}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Casos de Prueba</p>
              <p className="font-semibold text-emerald-600">{submissionDetails.testCasesPassed}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Código Enviado */}
      <Card>
        <CardHeader>
          <CardTitle>Código Enviado</CardTitle>
          <CardDescription>Código fuente del estudiante</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-secondary p-4 rounded-lg overflow-x-auto text-sm">
            <code>{submissionDetails.code}</code>
          </pre>
        </CardContent>
      </Card>

      {/* Resultado de Ejecución */}
      <Card>
        <CardHeader>
          <CardTitle>Resultado de Ejecución</CardTitle>
          <CardDescription>Output y logs del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-secondary p-4 rounded-lg overflow-x-auto text-sm">
            <code>{submissionDetails.executionOutput}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
