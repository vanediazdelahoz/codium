"use client"

import { use, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Trophy, Calendar, Users, Clock, Database, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

type Evaluation = {
  id: string
  name: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  challenges: number
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

export default function StudentCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const course = {
    id,
    name: "Estructuras de Datos",
    nrc: "12345",
    group: "Grupo 1",
    professor: "Dr. Juan Pérez",
  }

  const [challenges] = useState<Challenge[]>([
    {
      id: "1",
      title: "Algoritmo de Ordenamiento",
      difficulty: "Media",
      tags: ["Algoritmos", "Ordenamiento", "Recursión"],
      timeLimit: "1000",
      memoryLimit: "256",
      status: "Resuelto",
      score: 95,
      hasSubmission: true,
    },
    {
      id: "2",
      title: "Búsqueda Binaria",
      difficulty: "Fácil",
      tags: ["Búsqueda", "Arrays"],
      timeLimit: "500",
      memoryLimit: "128",
      status: "Resuelto",
      score: 100,
      hasSubmission: true,
    },
    {
      id: "3",
      title: "Árbol de Decisión",
      difficulty: "Difícil",
      tags: ["Árboles", "Recursión"],
      timeLimit: "2000",
      memoryLimit: "512",
      status: "Con Error",
      score: 45,
      hasSubmission: true,
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

  const [evaluations] = useState<Evaluation[]>(() => {
    // Evaluación A - Programada (30/11/2025)
    const startA = new Date("2025-11-30T14:00:00")
    const endA = new Date("2025-11-30T15:30:00")

    // Evaluación B - Activa (inició 28/11/2025 8:00 PM, termina 28/11/2025 11:00 PM)
    const startB = new Date("2025-11-28T20:00:00")
    const endB = new Date("2025-11-28T23:00:00")

    // Evaluación C - Finalizada (21/11/2025)
    const startC = new Date("2025-11-21T10:00:00")
    const endC = new Date("2025-11-21T12:00:00")

    const formatDate = (date: Date) => {
      return date.toISOString().split("T")[0]
    }

    const formatTime = (date: Date) => {
      return date.toTimeString().slice(0, 5)
    }

    return [
      {
        id: "1",
        name: "Evaluación A - Programada",
        startDate: formatDate(startA),
        startTime: formatTime(startA),
        endDate: formatDate(endA),
        endTime: formatTime(endA),
        challenges: 4,
      },
      {
        id: "2",
        name: "Evaluación B - Activa",
        startDate: formatDate(startB),
        startTime: formatTime(startB),
        endDate: formatDate(endB),
        endTime: formatTime(endB),
        challenges: 5,
      },
      {
        id: "3",
        name: "Evaluación C - Finalizada",
        startDate: formatDate(startC),
        startTime: formatTime(startC),
        endDate: formatDate(endC),
        endTime: formatTime(endC),
        challenges: 3,
      },
    ]
  })

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
      studentName: "Ana Martínez",
      studentId: "A00123459",
      score: 92,
      solvedChallenges: 4,
      totalChallenges: 4,
    },
    {
      rank: 4,
      studentName: "Luis Rodríguez",
      studentId: "A00123460",
      score: 88,
      solvedChallenges: 3,
      totalChallenges: 4,
    },
    {
      rank: 5,
      studentName: "Juan Pérez (Tú)",
      studentId: "A00123456",
      score: 85,
      solvedChallenges: 2,
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
      {
        rank: 3,
        studentName: "Juan Pérez (Tú)",
        studentId: "A00123456",
        score: 95,
        solvedChallenges: 1,
        totalChallenges: 1,
        isCurrentUser: true,
      },
    ],
    "2": [
      {
        rank: 1,
        studentName: "Juan Pérez (Tú)",
        studentId: "A00123456",
        score: 100,
        solvedChallenges: 1,
        totalChallenges: 1,
        isCurrentUser: true,
      },
      {
        rank: 2,
        studentName: "María García",
        studentId: "A00123457",
        score: 95,
        solvedChallenges: 1,
        totalChallenges: 1,
      },
      {
        rank: 3,
        studentName: "Ana Martínez",
        studentId: "A00123459",
        score: 90,
        solvedChallenges: 1,
        totalChallenges: 1,
      },
    ],
    "3": [
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
        studentName: "María García",
        studentId: "A00123457",
        score: 85,
        solvedChallenges: 1,
        totalChallenges: 1,
      },
      {
        rank: 3,
        studentName: "Juan Pérez (Tú)",
        studentId: "A00123456",
        score: 45,
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

  const getEvaluationStatus = (evaluation: Evaluation) => {
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

  const getEvaluationStatusColor = (status: string) => {
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
        <Link href="/student">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-balance">{course.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">NRC: {course.nrc}</Badge>
            <Badge variant="outline">{course.group}</Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profesor</p>
              <p className="text-lg font-semibold">{course.professor}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="challenges" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Retos
          </TabsTrigger>
          <TabsTrigger value="evaluations" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Evaluaciones
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges">
          <Card>
            <CardHeader>
              <CardTitle>Retos Disponibles</CardTitle>
              <CardDescription>Resuelve los retos y mejora tu posición en el ranking</CardDescription>
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
                        <Badge variant="outline" className={getStatusColor(challenge.status)}>
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

                          {challenge.hasSubmission ? (
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

        <TabsContent value="evaluations">
          <Card>
            <CardHeader>
              <CardTitle>Evaluaciones Programadas</CardTitle>
              <CardDescription>Evaluaciones formales con límite de tiempo</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Fecha y Hora de Inicio</TableHead>
                    <TableHead>Fecha y Hora de Finalización</TableHead>
                    <TableHead>Retos</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluations.map((evaluation) => {
                    const status = getEvaluationStatus(evaluation)
                    return (
                      <TableRow key={evaluation.id}>
                        <TableCell className="font-medium">{evaluation.name}</TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <div className="font-medium">{evaluation.startDate}</div>
                            <div className="text-sm text-muted-foreground">{evaluation.startTime}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <div className="font-medium">{evaluation.endDate}</div>
                            <div className="text-sm text-muted-foreground">{evaluation.endTime}</div>
                          </div>
                        </TableCell>
                        <TableCell>{evaluation.challenges}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getEvaluationStatusColor(status)}>
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/student/courses/${id}/evaluations/${evaluation.id}`}>
                            <Button variant="ghost" size="sm">
                              Ver Detalles
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle>Ranking del Curso</CardTitle>
              <CardDescription>Clasificación de estudiantes por puntaje acumulado</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Posición</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Puntaje</TableHead>
                    <TableHead>Retos Completados</TableHead>
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
