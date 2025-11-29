"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Trophy, ChevronDown, ChevronUp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ChallengeSubmission {
  challengeId: number
  score: number | null
  status: string | null
  time: string | null
}

interface RankingEntry {
  position: number
  student: string
  totalScore: number
  status: string
  totalTime: string
}

export default function StudentEvaluationPage({ params }: { params: { id: string } }) {
  const [expandedChallenge, setExpandedChallenge] = useState<number | null>(null)
  const [submissions, setSubmissions] = useState<Record<number, ChallengeSubmission>>({})
  const [codes, setCodes] = useState<Record<number, string>>({})
  const [languages, setLanguages] = useState<Record<number, string>>({})

  // Mock data
  const evaluation = {
    name: "Parcial 1 - Listas y Pilas",
    course: "Estructuras de Datos",
    duration: "2 horas",
    openDate: "2024-06-10T09:00:00",
    closeDate: "2024-06-10T11:00:00",
  }

  const challenges = [
    {
      id: 1,
      name: "Implementar Stack",
      description: "Implementa una pila (stack) con operaciones push, pop y peek.",
      difficulty: "Fácil",
      timeLimit: "1s",
    },
    {
      id: 2,
      name: "Validar Paréntesis",
      description: "Dado un string con paréntesis, valida si están balanceados.",
      difficulty: "Medio",
      timeLimit: "2s",
    },
    {
      id: 3,
      name: "Cola Circular",
      description: "Implementa una cola circular con capacidad fija.",
      difficulty: "Difícil",
      timeLimit: "2s",
    },
  ]

  const ranking: RankingEntry[] = [
    { position: 1, student: "Ana García", totalScore: 285, status: "Completado", totalTime: "2.1s" },
    { position: 2, student: "Carlos López", totalScore: 270, status: "Completado", totalTime: "3.5s" },
    { position: 3, student: "María Pérez", totalScore: 200, status: "Parcial", totalTime: "2.8s" },
  ]

  const handleSubmit = (challengeId: number) => {
    // Simulate submission
    setSubmissions({
      ...submissions,
      [challengeId]: {
        challengeId,
        score: Math.floor(Math.random() * 100),
        status: ["Accepted", "Wrong Answer", "Running", "Time Limit Exceeded"][Math.floor(Math.random() * 4)],
        time: `${(Math.random() * 2).toFixed(2)}s`,
      },
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
      case "Completado":
        return "bg-green-500/10 text-green-700 border-green-500/20"
      case "Wrong Answer":
      case "Parcial":
        return "bg-red-500/10 text-red-700 border-red-500/20"
      case "Running":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20"
      case "Time Limit Exceeded":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-500/10 text-green-700 border-green-500/20"
      case "Medio":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
      case "Difícil":
        return "bg-red-500/10 text-red-700 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Evaluation Information */}
      <Card className="p-6">
        <h1 className="text-3xl font-bold text-foreground mb-4">{evaluation.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Curso</p>
            <p className="font-medium">{evaluation.course}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Duración</p>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <p className="font-medium">{evaluation.duration}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Apertura</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <p className="font-medium text-sm">{new Date(evaluation.openDate).toLocaleString()}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Cierre</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <p className="font-medium text-sm">{new Date(evaluation.closeDate).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Challenges List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Retos del Parcial</h2>

        {challenges.map((challenge, index) => (
          <Card key={challenge.id} className="overflow-hidden">
            <div
              className="p-6 cursor-pointer hover:bg-secondary/50 transition-colors"
              onClick={() => setExpandedChallenge(expandedChallenge === challenge.id ? null : challenge.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{challenge.name}</h3>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
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
                    <span className="font-medium">{challenge.timeLimit}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Lenguaje de programación</label>
                  <Select
                    value={languages[challenge.id] || "python"}
                    onValueChange={(value) => setLanguages({ ...languages, [challenge.id]: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Tu código</label>
                  <Textarea
                    placeholder="Escribe o pega tu código aquí..."
                    className="min-h-[250px] font-mono text-sm"
                    value={codes[challenge.id] || ""}
                    onChange={(e) => setCodes({ ...codes, [challenge.id]: e.target.value })}
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
        ))}
      </div>

      {/* General Ranking */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold">Ranking General del Parcial</h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Pos.</TableHead>
              <TableHead>Estudiante</TableHead>
              <TableHead>Score Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Tiempo Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranking.map((entry) => (
              <TableRow key={entry.position}>
                <TableCell className="font-medium">#{entry.position}</TableCell>
                <TableCell>{entry.student}</TableCell>
                <TableCell className="text-lg font-bold">{entry.totalScore}/300</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(entry.status)}>{entry.status}</Badge>
                </TableCell>
                <TableCell>{entry.totalTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
