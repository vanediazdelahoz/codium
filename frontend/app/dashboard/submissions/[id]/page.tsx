"use client"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Eye, Clock, Users, CalendarDays } from "lucide-react"

// Mock data
const challengeDetails = {
  1: {
    type: "Reto",
    title: "Ordenamiento de Arrays",
    difficulty: "Medio",
    description: "Implementa diferentes algoritmos de ordenamiento",
    timeLimit: "2 horas",
    assignedGroups: ["Grupo 1", "Grupo 2"],
  },
  3: {
    type: "Parcial",
    title: "Parcial 1 - Fundamentos",
    challenges: ["Arrays y Listas", "Búsqueda Binaria", "Recursión"],
    duration: "90 minutos",
    openDate: "2025-01-18 08:00",
    closeDate: "2025-01-18 10:30",
  },
}

const submissions = [
  {
    id: 1,
    student: "Juan Pérez",
    status: "Accepted",
    timestamp: "2025-01-20 14:32:15",
    score: 100,
  },
  {
    id: 2,
    student: "María García",
    status: "Accepted",
    timestamp: "2025-01-20 14:28:42",
    score: 100,
  },
  {
    id: 3,
    student: "Carlos Rodríguez",
    status: "Wrong Answer",
    timestamp: "2025-01-20 14:45:10",
    score: 75,
  },
  {
    id: 4,
    student: "Ana Martínez",
    status: "Accepted",
    timestamp: "2025-01-20 13:55:22",
    score: 95,
  },
  {
    id: 5,
    student: "Luis Hernández",
    status: "Time Limit Exceeded",
    timestamp: "2025-01-20 14:15:33",
    score: 60,
  },
  {
    id: 6,
    student: "Patricia López",
    status: "Runtime Error",
    timestamp: "2025-01-20 14:02:18",
    score: 40,
  },
  {
    id: 7,
    student: "Roberto Sánchez",
    status: "Running",
    timestamp: "2025-01-20 15:01:05",
    score: 0,
  },
  {
    id: 8,
    student: "Elena Torres",
    status: "Compilation Error",
    timestamp: "2025-01-20 13:48:27",
    score: 0,
  },
]

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Accepted: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    "Wrong Answer": "bg-rose-500/10 text-rose-700 border-rose-500/20",
    Running: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    "Time Limit Exceeded": "bg-amber-500/10 text-amber-700 border-amber-500/20",
    "Runtime Error": "bg-red-500/10 text-red-700 border-red-500/20",
    "Compilation Error": "bg-orange-500/10 text-orange-700 border-orange-500/20",
    "En Cola": "bg-gray-500/10 text-gray-700 border-gray-500/20",
  }
  return colors[status] || "bg-gray-500/10 text-gray-700 border-gray-500/20"
}

export default function SubmissionDetailPage() {
  const params = useParams()
  const id = params.id as string
  const details = challengeDetails[id as keyof typeof challengeDetails]

  // Sort submissions by score (descending)
  const sortedSubmissions = [...submissions].sort((a, b) => b.score - a.score)

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/submissions">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Submissions
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-balance">{details?.title || "Detalle de Envíos"}</h1>
      </div>

      {/* Resumen del Reto o Parcial */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
          <CardDescription>Información del {details?.type}</CardDescription>
        </CardHeader>
        <CardContent>
          {details?.type === "Reto" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Dificultad</h3>
                <Badge>{details.difficulty}</Badge>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Límite de tiempo
                </h3>
                <p className="text-sm text-muted-foreground">{details.timeLimit}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="font-semibold mb-2">Descripción</h3>
                <p className="text-sm text-muted-foreground">{details.description}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Grupos asignados
                </h3>
                <div className="flex gap-2">
                  {details.assignedGroups?.map((group) => (
                    <Badge key={group} variant="outline">
                      {group}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {details?.type === "Parcial" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Retos incluidos</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {details.challenges?.map((challenge) => (
                    <li key={challenge}>• {challenge}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Duración
                </h3>
                <p className="text-sm text-muted-foreground">{details.duration}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Fecha de apertura
                </h3>
                <p className="text-sm text-muted-foreground">{details.openDate}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Fecha de cierre
                </h3>
                <p className="text-sm text-muted-foreground">{details.closeDate}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ranking de Envíos */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking de Envíos</CardTitle>
          <CardDescription>Ordenado por puntuación de mayor a menor</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Estudiante</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSubmissions.map((submission, index) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{submission.student}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(submission.status)}>
                      {submission.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{submission.timestamp}</TableCell>
                  <TableCell className="text-right font-semibold">{submission.score}</TableCell>
                  <TableCell className="text-center">
                    <Link href={`/dashboard/submissions/${id}/view/${submission.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
