"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Trophy, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { apiClient } from "@/lib/api-client"

interface ChallengeSubmission {
  challengeId: number
  score: number | null
  status: string | null
  time: string | null
}

interface Evaluation {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  status: string
}

interface ChallengeData {
  id: string
  title: string
  description: string
  difficulty: string
  timeLimit: number
}

export default function StudentEvaluationPage({ params }: { params: { id: string } }) {
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null)
  const [submissions, setSubmissions] = useState<Record<string, ChallengeSubmission>>({})
  const [codes, setCodes] = useState<Record<string, string>>({})
  const [languages, setLanguages] = useState<Record<string, string>>({})
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [challenges, setChallenges] = useState<ChallengeData[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [params.id])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [evalData, leaderboardData] = await Promise.all([
        apiClient.evaluationsApi.get(params.id),
        apiClient.leaderboardsApi.getEvaluationLeaderboard(params.id, 10),
      ])
      setEvaluation(evalData)
      setLeaderboard(leaderboardData || [])
      // TODO: Obtener challenges de la evaluación
    } catch (err) {
      console.error("Error loading evaluation:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (challengeId: string) => {
    try {
      const result = await apiClient.submissionsApi.submit({
        challengeId,
        code: codes[challengeId],
        language: languages[challengeId] || "PYTHON",
        evaluationId: params.id,
      })
      setSubmissions({
        ...submissions,
        [challengeId]: {
          challengeId: parseInt(challengeId),
          score: result.score || 0,
          status: result.status,
          time: `${result.timeMsTotal}ms`,
        },
      })
    } catch (err) {
      console.error("Error submitting:", err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
      case "Completado":
        return "bg-green-500/10 text-green-700 border-green-500/20"
      case "WRONG_ANSWER":
      case "Parcial":
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

  if (!evaluation) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Evaluación no encontrada</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Evaluation Information */}
      <Card className="p-6">
        <h1 className="text-3xl font-bold text-foreground mb-4">{evaluation.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {evaluation.description && (
            <div className="space-y-1 col-span-full">
              <p className="text-sm text-muted-foreground">Descripción</p>
              <p className="font-medium">{evaluation.description}</p>
            </div>
          )}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Inicio</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <p className="font-medium text-sm">{new Date(evaluation.startDate).toLocaleString()}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Cierre</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <p className="font-medium text-sm">{new Date(evaluation.endDate).toLocaleString()}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Estado</p>
            <Badge variant="outline">{evaluation.status}</Badge>
          </div>
        </div>
      </Card>

      {/* Challenges List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Retos del Parcial</h2>

        {challenges.length === 0 ? (
          <Card className="p-6">
            <p className="text-muted-foreground text-center">No hay retos disponibles en esta evaluación</p>
          </Card>
        ) : (
          challenges.map((challenge: any, index: number) => (
            <Card key={challenge.id} className="overflow-hidden">
              <div
                className="p-6 cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={() =>
                  setExpandedChallenge(expandedChallenge === challenge.id ? null : challenge.id)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                    <div>
                      <h3 className="text-lg font-semibold">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {getDifficultyLabel(challenge.difficulty)}
                    </Badge>
                    {submissions[challenge.id] && (
                      <Badge className={getStatusColor(submissions[challenge.id].status!)}>
                        Score: {submissions[challenge.id].score}
                      </Badge>
                    )}
                    {expandedChallenge === challenge.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </div>

              {expandedChallenge === challenge.id && (
                <div className="border-t p-6 bg-secondary/20 space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Límite de tiempo: </span>
                      <span className="font-medium">{challenge.timeLimit}ms</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Lenguaje de programación</label>
                    <Select
                      value={languages[challenge.id] || "PYTHON"}
                      onValueChange={(value: any) => setLanguages({ ...languages, [challenge.id]: value })}
                    >
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
                      className="min-h-[250px] font-mono text-sm"
                      value={codes[challenge.id] || ""}
                      onChange={(e: any) => setCodes({ ...codes, [challenge.id]: e.target.value })}
                    />
                  </div>

                  <Button onClick={() => handleSubmit(challenge.id)} className="w-full">
                    Enviar código
                  </Button>

                  {submissions[challenge.id] && (
                    <Card className="p-4 bg-background">
                      <h4 className="font-semibold mb-3">Resultado</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Score</p>
                          <p className="text-xl font-bold">{submissions[challenge.id].score}/100</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Estado</p>
                          <Badge className={getStatusColor(submissions[challenge.id].status!)}>
                            {submissions[challenge.id].status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tiempo</p>
                          <p className="text-lg font-medium">{submissions[challenge.id].time}</p>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* General Ranking */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold">Ranking General del Parcial</h2>
        </div>

        {leaderboard.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No hay resultados todavía</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Pos.</TableHead>
                <TableHead>Estudiante</TableHead>
                <TableHead>Score Total</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((entry: any, index: number) => (
                <TableRow key={entry.userId || index}>
                  <TableCell className="font-medium">#{index + 1}</TableCell>
                  <TableCell>
                    {entry.user ? `${entry.user.firstName} ${entry.user.lastName}` : "Usuario Desconocido"}
                  </TableCell>
                  <TableCell className="text-lg font-bold">{entry.score || 0}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(entry.status || "Parcial")}>
                      {entry.status || "En progreso"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
