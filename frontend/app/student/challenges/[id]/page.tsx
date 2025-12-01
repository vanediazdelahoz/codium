"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Tag, Trophy, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { apiClient } from "@/lib/api-client"

interface Submission {
  score: number
  status: string
  time: string
}

interface Challenge {
  id: string
  title: string
  description: string
  course?: string
  difficulty: string
  tags: string[]
  timeLimit: number
  deadline?: string
}

export default function StudentChallengePage({ params }: { params: { id: string } }) {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("PYTHON")
  const [lastSubmission, setLastSubmission] = useState<Submission | null>(null)
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [params.id])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [challengeData, leaderboardData] = await Promise.all([
        apiClient.challengesApi.get(params.id),
        apiClient.leaderboardsApi.getChallengeLeaderboard(params.id, 10),
      ])
      setChallenge(challengeData)
      setLeaderboard(leaderboardData || [])
    } catch (err) {
      console.error("Error loading challenge data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const data = await apiClient.submissionsApi.submit({
        challengeId: params.id,
        code,
        language,
      })
      setLastSubmission({
        score: data.score || 0,
        status: data.status,
        time: `${data.timeMsTotal}ms`,
      })
    } catch (err) {
      console.error("Error submitting code:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-500/10 text-green-700 border-green-500/20"
      case "WRONG_ANSWER":
        return "bg-red-500/10 text-red-700 border-red-500/20"
      case "RUNNING":
      case "QUEUED":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20"
      case "TIME_LIMIT_EXCEEDED":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-500/10 text-green-700 border-green-500/20"
      case "MEDIUM":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
      case "HARD":
        return "bg-red-500/10 text-red-700 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "Fácil"
      case "MEDIUM":
        return "Medio"
      case "HARD":
        return "Difícil"
      default:
        return difficulty
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Reto no encontrado</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Challenge Information */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-bold text-foreground">{challenge.title}</h1>
          <Badge className={getDifficultyColor(challenge.difficulty)}>{getDifficultyLabel(challenge.difficulty)}</Badge>
        </div>

        <p className="text-muted-foreground mb-6">{challenge.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {challenge.course && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Curso:</span>
              <span className="font-medium">{challenge.course}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Límite:</span>
            <span className="font-medium">{challenge.timeLimit}ms</span>
          </div>
          {challenge.deadline && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Fecha límite:</span>
              <span className="font-medium">{new Date(challenge.deadline).toLocaleDateString()}</span>
            </div>
          )}
          {challenge.tags.length > 0 && (
            <div className="flex items-center gap-2 text-sm col-span-2 md:col-span-3">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-1 flex-wrap">
                {challenge.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Code Submission Area */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Envía tu solución</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Lenguaje de programación</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PYTHON">Python</SelectItem>
                <SelectItem value="JAVA">Java</SelectItem>
                <SelectItem value="CPP">C++</SelectItem>
                <SelectItem value="NODEJS">JavaScript/Node.js</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Tu código</label>
            <Textarea
              placeholder="Escribe o pega tu código aquí..."
              className="min-h-[300px] font-mono text-sm"
              value={code}
              onChange={(e: any) => setCode(e.target.value)}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            {isSubmitting ? "Enviando..." : "Enviar código"}
          </Button>
        </div>
      </Card>

      {/* Last Submission Result */}
      {lastSubmission && (
        <Card className="p-6 bg-secondary/50">
          <h2 className="text-xl font-semibold mb-4">Resultado de tu último envío</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="text-2xl font-bold">{lastSubmission.score}/100</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Estado</p>
              <Badge className={getStatusColor(lastSubmission.status)}>{lastSubmission.status}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tiempo</p>
              <p className="text-lg font-medium">{lastSubmission.time}</p>
            </div>
          </div>
        </Card>
      )}

      {/* General Ranking */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold">Ranking General del Reto</h2>
        </div>

        {leaderboard.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No hay resultados todavía</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Pos.</TableHead>
                <TableHead>Estudiante</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Tiempo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((entry: any, index: number) => (
                <TableRow key={entry.userId || index}>
                  <TableCell className="font-medium">#{index + 1}</TableCell>
                  <TableCell>
                    {entry.user ? `${entry.user.firstName} ${entry.user.lastName}` : "Usuario Desconocido"}
                  </TableCell>
                  <TableCell>{entry.score}/100</TableCell>
                  <TableCell>{entry.timeMsTotal}ms</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
