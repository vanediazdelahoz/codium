"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, Target, Trophy } from "lucide-react"

type RankingEntry = {
  student: string
  challenge: string
  score: number
  status: "Completado" | "En progreso" | "No enviado" | "Error"
  time: string
}

export default function EvaluationDetailPage() {
  const evaluation = {
    name: "Parcial Medio Término",
    duration: "120 minutos",
    openDate: "2024-06-10 08:00",
    closeDate: "2024-06-12 23:59",
    challenges: ["Algoritmo de Ordenamiento", "Búsqueda Binaria", "Lista Enlazada"],
  }

  const ranking: RankingEntry[] = [
    {
      student: "María García",
      challenge: "Algoritmo de Ordenamiento",
      score: 100,
      status: "Completado",
      time: "45 min",
    },
    { student: "Juan Pérez", challenge: "Algoritmo de Ordenamiento", score: 95, status: "Completado", time: "52 min" },
    { student: "María García", challenge: "Búsqueda Binaria", score: 90, status: "Completado", time: "30 min" },
    {
      student: "Carlos Rodríguez",
      challenge: "Algoritmo de Ordenamiento",
      score: 85,
      status: "Completado",
      time: "68 min",
    },
    { student: "Juan Pérez", challenge: "Búsqueda Binaria", score: 85, status: "Completado", time: "35 min" },
    { student: "Ana López", challenge: "Algoritmo de Ordenamiento", score: 80, status: "Completado", time: "70 min" },
    { student: "Carlos Rodríguez", challenge: "Lista Enlazada", score: 75, status: "En progreso", time: "40 min" },
    { student: "Ana López", challenge: "Búsqueda Binaria", score: 70, status: "Completado", time: "42 min" },
    { student: "Pedro Martínez", challenge: "Algoritmo de Ordenamiento", score: 0, status: "Error", time: "15 min" },
    { student: "Luis Sánchez", challenge: "Algoritmo de Ordenamiento", score: 0, status: "No enviado", time: "-" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completado":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "En progreso":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "No enviado":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      default:
        return ""
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400 font-bold"
    if (score >= 70) return "text-blue-600 dark:text-blue-400 font-semibold"
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/evaluations">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-balance">{evaluation.name}</h1>
          <p className="text-muted-foreground mt-2">Ranking de desempeño de estudiantes</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duración</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evaluation.duration}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inicio</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{evaluation.openDate}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cierre</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{evaluation.closeDate}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evaluation.challenges.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Retos Incluidos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {evaluation.challenges.map((challenge, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm">{challenge}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Ranking de Estudiantes</CardTitle>
              <CardDescription>Ordenado por puntuación (mayor a menor)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Estudiante</TableHead>
                <TableHead>Reto</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Tiempo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranking.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {index === 0 && <Trophy className="h-4 w-4 text-yellow-500 inline mr-1" />}
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{entry.student}</TableCell>
                  <TableCell className="text-muted-foreground">{entry.challenge}</TableCell>
                  <TableCell className="text-center">
                    <span className={getScoreColor(entry.score)}>{entry.score}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(entry.status)}>
                      {entry.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{entry.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
