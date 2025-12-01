"use client"

import { use, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, AlertCircle, Eye, Trophy, Database } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Challenge = {
  id: string
  title: string
  difficulty: string
  tags: string[]
  timeLimit: string
  memoryLimit: string
  status: "Pendiente" | "Resuelto" | "Con Error"
  score: number | null
  hasSubmission: boolean
}

type LeaderboardEntry = {
  rank: number
  studentName: string
  studentId: string
  score: number
  solvedChallenges: number
  totalChallenges: number
  isCurrentUser?: boolean
}

export default function StudentEvaluationDetailPage({
  params,
}: {
  params: Promise<{ id: string; evaluationId: string }>
}) {
  const { id, evaluationId } = use(params)

  const evaluation = {
    id: evaluationId,
    name: "Parcial Medio Término",
    description: "Evaluación de mitad de semestre sobre algoritmos y estructuras de datos",
    startDate: "2024-06-20",
    startTime: "14:00",
    endDate: "2024-06-20",
    endTime: "16:00",
  }

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

  const [challenges] = useState<Challenge[]>([
    {
      id: "1",
      title: "Algoritmo de Ordenamiento",
      difficulty: "Media",
      tags: ["Algoritmos", "Ordenamiento"],
      timeLimit: "1000",
      memoryLimit: "256",
      status: "Pendiente",
      score: null,
      hasSubmission: false,
    },
    {
      id: "2",
      title: "Búsqueda Binaria",
      difficulty: "Fácil",
      tags: ["Búsqueda", "Arrays"],
      timeLimit: "500",
      memoryLimit: "128",
      status: "Pendiente",
      score: null,
      hasSubmission: false,
    },
    {
      id: "3",
      title: "Árbol de Decisión",
      difficulty: "Difícil",
      tags: ["Árboles", "Recursión"],
      timeLimit: "2000",
      memoryLimit: "512",
      status: "Pendiente",
      score: null,
      hasSubmission: false,
    },
    {
      id: "4",
      title: "Lista Enlazada",
      difficulty: "Media",
      tags: ["Estructuras", "Listas"],
      timeLimit: "1500",
      memoryLimit: "256",
      status: "Pendiente",
      score: null,
      hasSubmission: false,
    },
  ])

  const [leaderboard] = useState<LeaderboardEntry[]>([
    {
      rank: 1,
      studentName: "Carlos López",
      studentId: "A00123458",
      score: 98,
      solvedChallenges: 4,
      totalChallenges: 4,
    },
    {
      rank: 2,
      studentName: "María García",
      studentId: "A00123457",
      score: 95,
      solvedChallenges: 4,
      totalChallenges: 4,
    },
    {
      rank: 3,
      studentName: "Juan Pérez (Tú)",
      studentId: "A00123456",
      score: 85,
      solvedChallenges: 3,
      totalChallenges: 4,
      isCurrentUser: true,
    },
  ])

  const [selectedChallengeLeaderboard, setSelectedChallengeLeaderboard] = useState<string | null>(null)
  const [challengeLeaderboards] = useState<Record<string, LeaderboardEntry[]>>({
    "1": [
      {
        rank: 1,
        studentName: "María García",
        studentId: "A00123457",
        score: 100,
        solvedChallenges: 1,
        totalChallenges: 1,
      },
      {
        rank: 2,
        studentName: "Carlos López",
        studentId: "A00123458",
        score: 95,
        solvedChallenges: 1,
        totalChallenges: 1,
      },
    ],
    "2": [
      {
        rank: 1,
        studentName: "Carlos López",
        studentId: "A00123458",
        score: 100,
        solvedChallenges: 1,
        totalChallenges: 1,
      },
      {
        rank: 2,
        studentName: "Juan Pérez (Tú)",
        studentId: "A00123456",
        score: 90,
        solvedChallenges: 1,
        totalChallenges: 1,
        isCurrentUser: true,
      },
    ],
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Media":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Difícil":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return ""
    }
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

  const getChallengeStatusColor = (status: string) => {
    switch (status) {
      case "Resuelto":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Con Error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "Pendiente":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/student/courses/${id}`}>
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

      {status === "Programada" && (
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-blue-900 dark:text-blue-100">Evaluación Programada</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Esta evaluación aún no ha comenzado. Estará disponible a partir de la fecha y hora de inicio.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {status === "Activa" && (
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-green-900 dark:text-green-100">Evaluación Activa</p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  La evaluación está en curso. Completa todos los retos antes de que finalice el tiempo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {status === "Finalizada" && (
        <Card className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Evaluación Finalizada</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Esta evaluación ha finalizado. Puedes ver tus resultados y el leaderboard.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
          <TabsTrigger value="challenges">Retos de la Evaluación</TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges">
          <Card>
            <CardHeader>
              <CardTitle>Retos de la Evaluación</CardTitle>
              <CardDescription>
                {status === "Activa"
                  ? "Resuelve los retos antes de que finalice el tiempo"
                  : status === "Finalizada"
                    ? "Retos de esta evaluación"
                    : "Los retos estarán disponibles cuando comience la evaluación"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Dificultad</TableHead>
                    <TableHead>Límites</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Puntaje</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {challenges.map((challenge) => (
                    <TableRow key={challenge.id}>
                      <TableCell>
                        <div className="font-medium">{challenge.title}</div>
                        <div className="flex gap-1 mt-1">
                          {challenge.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{challenge.timeLimit}ms</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Database className="h-3 w-3" />
                          <span>{challenge.memoryLimit}MB</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getChallengeStatusColor(challenge.status)}>
                          {challenge.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {challenge.score !== null ? (
                          <span className="font-bold text-primary">{challenge.score}/100</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {(status === "Activa" || status === "Finalizada") && (
                            <Dialog
                              open={selectedChallengeLeaderboard === challenge.id}
                              onOpenChange={(open) => !open && setSelectedChallengeLeaderboard(null)}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedChallengeLeaderboard(challenge.id)}
                                >
                                  <Trophy className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>Leaderboard: {challenge.title}</DialogTitle>
                                  <DialogDescription>Clasificación de estudiantes para este reto</DialogDescription>
                                </DialogHeader>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="w-[80px]">Posición</TableHead>
                                      <TableHead>Nombre</TableHead>
                                      <TableHead>Código</TableHead>
                                      <TableHead>Puntaje</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {(challengeLeaderboards[challenge.id] || []).map((entry) => (
                                      <TableRow
                                        key={entry.studentId}
                                        className={entry.isCurrentUser ? "bg-primary/5" : ""}
                                      >
                                        <TableCell className="font-bold text-lg">
                                          {entry.rank === 1 && "🥇"}
                                          {entry.rank === 2 && "🥈"}
                                          {entry.rank === 3 && "🥉"}
                                          {entry.rank > 3 && `${entry.rank}°`}
                                        </TableCell>
                                        <TableCell className={entry.isCurrentUser ? "font-bold" : "font-medium"}>
                                          {entry.studentName}
                                        </TableCell>
                                        <TableCell>{entry.studentId}</TableCell>
                                        <TableCell>
                                          <span className="text-lg font-bold">{entry.score}</span>
                                          <span className="text-muted-foreground">/100</span>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </DialogContent>
                            </Dialog>
                          )}

                          {status === "Activa" ? (
                            challenge.hasSubmission ? (
                              <Link href={`/student/courses/${id}/challenges/${challenge.id}?mode=view`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Solución
                                </Button>
                              </Link>
                            ) : (
                              <Link href={`/student/courses/${id}/challenges/${challenge.id}?mode=resolve`}>
                                <Button variant="ghost" size="sm">
                                  Resolver
                                </Button>
                              </Link>
                            )
                          ) : status === "Finalizada" ? (
                            <Link href={`/student/courses/${id}/challenges/${challenge.id}?mode=view`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Ver
                              </Button>
                            </Link>
                          ) : (
                            <Button variant="ghost" size="sm" disabled>
                              No Disponible
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard de la Evaluación</CardTitle>
              <CardDescription>Clasificación de estudiantes por puntaje total en la evaluación</CardDescription>
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
                    <TableRow key={entry.studentId} className={entry.isCurrentUser ? "bg-primary/5" : ""}>
                      <TableCell className="font-bold text-lg">
                        {entry.rank === 1 && "🥇"}
                        {entry.rank === 2 && "🥈"}
                        {entry.rank === 3 && "🥉"}
                        {entry.rank > 3 && `${entry.rank}°`}
                      </TableCell>
                      <TableCell className={entry.isCurrentUser ? "font-bold" : "font-medium"}>
                        {entry.studentName}
                      </TableCell>
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
