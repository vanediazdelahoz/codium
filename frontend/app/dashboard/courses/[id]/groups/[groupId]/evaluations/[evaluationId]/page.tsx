"use client"

import { use, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, Trophy, Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GroupChallenges } from "@/components/group-challenges"

type LeaderboardEntry = {
  rank: number
  studentName: string
  studentId: string
  score: number
  solvedChallenges: number
  totalChallenges: number
}

export default function EvaluationDetailPage({
  params,
}: {
  params: Promise<{ id: string; groupId: string; evaluationId: string }>
}) {
  const { id: courseId, groupId, evaluationId } = use(params)

  const evaluation = {
    id: evaluationId,
    name: "Parcial Medio Término",
    description: "Evaluación de mitad de semestre sobre algoritmos y estructuras de datos",
    startDate: "2024-06-20",
    startTime: "14:00",
    endDate: "2024-06-20",
    endTime: "16:00",
  }

  // Función para calcular el estado de la evaluación
  const getEvaluationStatus = () => {
    const now = new Date()
    const startDateTime = new Date(`${evaluation.startDate}T${evaluation.startTime}`)
    const endDateTime = new Date(`${evaluation.endDate}T${evaluation.endTime}`)

    if (now < startDateTime) {
      return "Programada"
    } else if (now >= startDateTime && now <= endDateTime) {
      return "Activa"
    } else {
      return "Finalizada"
    }
  }

  const status = getEvaluationStatus()

  const [leaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, studentName: "Juan Pérez", studentId: "A00123456", score: 95, solvedChallenges: 4, totalChallenges: 4 },
    {
      rank: 2,
      studentName: "María García",
      studentId: "A00123457",
      score: 87,
      solvedChallenges: 3,
      totalChallenges: 4,
    },
    {
      rank: 3,
      studentName: "Carlos López",
      studentId: "A00123458",
      score: 78,
      solvedChallenges: 3,
      totalChallenges: 4,
    },
  ])

  const handleDownloadResults = () => {
    const headers = ["Posición", "Nombre", "Código Estudiante", "Puntaje", "Retos Resueltos"]
    const rows = leaderboard.map((entry) => [
      entry.rank,
      entry.studentName,
      entry.studentId,
      entry.score,
      `${entry.solvedChallenges}/${entry.totalChallenges}`,
    ])
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `evaluacion-${evaluation.name.toLowerCase().replace(/\s+/g, "-")}-resultados.csv`
    link.click()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activa":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Programada":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Finalizada":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/courses/${courseId}/groups/${groupId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-balance">{evaluation.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className={getStatusColor(status)}>
              {status}
            </Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Descripción</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{evaluation.description}</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inicio</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold">{evaluation.startDate}</div>
              <div className="text-lg text-muted-foreground">{evaluation.startTime}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finalización</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold">{evaluation.endDate}</div>
              <div className="text-lg text-muted-foreground">{evaluation.endTime}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="challenges" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="challenges">Retos</TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges">
          <GroupChallenges courseId={courseId} groupId={groupId} isInEvaluation={true} />
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Leaderboard de la Evaluación</CardTitle>
                  <CardDescription>Clasificación de estudiantes por puntaje</CardDescription>
                </div>
                <Button onClick={handleDownloadResults}>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Resultados
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Posición</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Puntaje</TableHead>
                    <TableHead>Retos Resueltos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map((entry) => (
                    <TableRow key={entry.studentId}>
                      <TableCell className="font-bold text-lg">
                        {entry.rank === 1 && "🥇"}
                        {entry.rank === 2 && "🥈"}
                        {entry.rank === 3 && "🥉"}
                        {entry.rank > 3 && `${entry.rank}°`}
                      </TableCell>
                      <TableCell className="font-medium">{entry.studentName}</TableCell>
                      <TableCell>{entry.studentId}</TableCell>
                      <TableCell>
                        <span className="text-lg font-bold">{entry.score}</span>
                        <span className="text-muted-foreground">/100</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {entry.solvedChallenges}/{entry.totalChallenges}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
