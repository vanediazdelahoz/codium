"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"

type LeaderboardEntry = {
  userId: string
  user?: {
    firstName: string
    lastName: string
  }
  score: number
  timeMsTotal: number
  language?: string
  createdAt?: string
}

export function ChallengeLeaderboard({ challengeId }: { challengeId: string }) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [challengeId])

  const loadLeaderboard = async () => {
    setIsLoading(true)
    try {
      const data = await apiClient.leaderboardsApi.getChallengeLeaderboard(challengeId, 100)
      // Ordenar por score descendente, luego por tiempo ascendente
      const sorted = (data || []).sort((a: any, b: any) => {
        if (b.score !== a.score) return b.score - a.score
        return a.timeMsTotal - b.timeMsTotal
      })
      setLeaderboard(sorted)
    } catch (err) {
      console.error("Error loading leaderboard:", err)
    } finally {
      setIsLoading(false)
    }
  }

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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard del Reto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard del Reto</CardTitle>
        <CardDescription>Mejor envío de cada estudiante ordenado por puntaje y tiempo de ejecución</CardDescription>
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No hay resultados todavía</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Pos.</TableHead>
                <TableHead>Estudiante</TableHead>
                <TableHead>Puntaje</TableHead>
                <TableHead>Tiempo</TableHead>
                {leaderboard.some((e) => e.language) && <TableHead>Lenguaje</TableHead>}
                {leaderboard.some((e) => e.createdAt) && <TableHead>Fecha</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((entry: any, index: number) => (
                <TableRow key={entry.userId}>
                  <TableCell className="text-center">{getRankIcon(index + 1)}</TableCell>
                  <TableCell className="font-medium">
                    {entry.user ? `${entry.user.firstName} ${entry.user.lastName}` : "Usuario Desconocido"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={entry.score === 100 ? "default" : "secondary"} className="font-bold">
                      {entry.score}/100
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{entry.timeMsTotal}ms</TableCell>
                  {leaderboard.some((e) => e.language) && (
                    <TableCell>
                      <Badge variant="outline">{entry.language || "N/A"}</Badge>
                    </TableCell>
                  )}
                  {leaderboard.some((e) => e.createdAt) && (
                    <TableCell className="text-sm text-muted-foreground">
                      {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : "N/A"}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
