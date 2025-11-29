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
  totalScore: number
  solvedChallenges: number
  totalChallenges: number
  averageTime: string
}

export function GroupLeaderboard({ courseId, groupId }: { courseId: string; groupId: string }) {
  const [leaderboard] = useState<LeaderboardEntry[]>([
    {
      rank: 1,
      studentId: "A00123456",
      studentName: "Juan Pérez",
      totalScore: 950,
      solvedChallenges: 10,
      totalChallenges: 12,
      averageTime: "45m",
    },
    {
      rank: 2,
      studentId: "A00123457",
      studentName: "María García",
      totalScore: 920,
      solvedChallenges: 9,
      totalChallenges: 12,
      averageTime: "52m",
    },
    {
      rank: 3,
      studentId: "A00123458",
      studentName: "Carlos López",
      totalScore: 890,
      solvedChallenges: 9,
      totalChallenges: 12,
      averageTime: "48m",
    },
    {
      rank: 4,
      studentId: "A00123459",
      studentName: "Ana Martínez",
      totalScore: 850,
      solvedChallenges: 8,
      totalChallenges: 12,
      averageTime: "55m",
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
        <CardTitle>Leaderboard del Grupo</CardTitle>
        <CardDescription>
          Clasificación basada en el puntaje obtenido en todos los retos del curso (no incluye evaluaciones)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Posición</TableHead>
              <TableHead>Estudiante</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Puntaje Total</TableHead>
              <TableHead>Retos Resueltos</TableHead>
              <TableHead>Tiempo Promedio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((entry) => (
              <TableRow key={entry.studentId}>
                <TableCell className="text-center">{getRankIcon(entry.rank)}</TableCell>
                <TableCell className="font-medium">{entry.studentName}</TableCell>
                <TableCell>{entry.studentId}</TableCell>
                <TableCell>
                  <Badge variant="default" className="font-bold">
                    {entry.totalScore} pts
                  </Badge>
                </TableCell>
                <TableCell>
                  {entry.solvedChallenges}/{entry.totalChallenges}
                </TableCell>
                <TableCell className="text-muted-foreground">{entry.averageTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
