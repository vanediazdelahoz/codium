"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"

type LeaderboardEntry = {
  rank: number
  studentId: string
  studentName: string
  score: number
  executionTime: string
  language: string
  submittedAt: string
}

export function ChallengeLeaderboard({ challengeId }: { challengeId: string }) {
  const [leaderboard] = useState<LeaderboardEntry[]>([
    {
      rank: 1,
      studentId: "A00123456",
      studentName: "Juan Pérez",
      score: 100,
      executionTime: "0.32s",
      language: "C++",
      submittedAt: "2024-06-15 14:30",
    },
    {
      rank: 2,
      studentId: "A00123458",
      studentName: "Carlos López",
      score: 100,
      executionTime: "0.45s",
      language: "Python",
      submittedAt: "2024-06-15 14:25",
    },
    {
      rank: 3,
      studentId: "A00123459",
      studentName: "Ana Martínez",
      score: 100,
      executionTime: "0.58s",
      language: "Java",
      submittedAt: "2024-06-15 14:20",
    },
    {
      rank: 4,
      studentId: "A00123457",
      studentName: "María García",
      score: 80,
      executionTime: "0.41s",
      language: "Python",
      submittedAt: "2024-06-15 14:18",
    },
  ])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-muted-foreground font-bold">{rank}</span>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard del Reto</CardTitle>
        <CardDescription>Mejor envío de cada estudiante ordenado por puntaje y tiempo de ejecución</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Pos.</TableHead>
              <TableHead>Estudiante</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Puntaje</TableHead>
              <TableHead>Tiempo</TableHead>
              <TableHead>Lenguaje</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((entry) => (
              <TableRow key={entry.studentId}>
                <TableCell className="text-center">{getRankIcon(entry.rank)}</TableCell>
                <TableCell className="font-medium">{entry.studentName}</TableCell>
                <TableCell>{entry.studentId}</TableCell>
                <TableCell>
                  <Badge variant={entry.score === 100 ? "default" : "secondary"} className="font-bold">
                    {entry.score}/100
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{entry.executionTime}</TableCell>
                <TableCell>
                  <Badge variant="outline">{entry.language}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{entry.submittedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
