"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Tag, Trophy, User } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Submission {
  score: number
  status: string
  time: string
}

interface RankingEntry {
  position: number
  student: string
  score: number
  status: string
  time: string
}

export default function StudentChallengePage({ params }: { params: { id: string } }) {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("python")
  const [lastSubmission, setLastSubmission] = useState<Submission | null>(null)

  // Mock data
  const challenge = {
    name: "Implementar Lista Enlazada",
    description:
      "Implementa una lista enlazada simple con las operaciones básicas: insertar, eliminar, buscar y recorrer. La lista debe poder almacenar valores enteros.",
    course: "Estructuras de Datos",
    difficulty: "Medio",
    tags: ["Listas", "Estructuras"],
    timeLimit: "2 segundos",
    deadline: "2024-06-15",
  }

  const ranking: RankingEntry[] = [
    { position: 1, student: "Ana García", score: 100, status: "Accepted", time: "0.5s" },
    { position: 2, student: "Carlos López", score: 100, status: "Accepted", time: "0.8s" },
    { position: 3, student: "María Pérez", score: 85, status: "Wrong Answer", time: "1.2s" },
    { position: 4, student: "Juan Martínez", score: 70, status: "Time Limit Exceeded", time: "2.5s" },
  ]

  const handleSubmit = () => {
    // Simulate submission
    setLastSubmission({
      score: Math.floor(Math.random() * 100),
      status: ["Accepted", "Wrong Answer", "Running", "Time Limit Exceeded"][Math.floor(Math.random() * 4)],
      time: `${(Math.random() * 2).toFixed(2)}s`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return "bg-green-500/10 text-green-700 border-green-500/20"
      case "Wrong Answer":
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
      {/* Challenge Information */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-bold text-foreground">{challenge.name}</h1>
          <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
        </div>

        <p className="text-muted-foreground mb-6">{challenge.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Curso:</span>
            <span className="font-medium">{challenge.course}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Límite:</span>
            <span className="font-medium">{challenge.timeLimit}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Fecha límite:</span>
            <span className="font-medium">{new Date(challenge.deadline).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1">
              {challenge.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
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
              className="min-h-[300px] font-mono text-sm"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Enviar código
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

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Pos.</TableHead>
              <TableHead>Estudiante</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Tiempo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranking.map((entry) => (
              <TableRow key={entry.position}>
                <TableCell className="font-medium">#{entry.position}</TableCell>
                <TableCell>{entry.student}</TableCell>
                <TableCell>{entry.score}/100</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(entry.status)}>{entry.status}</Badge>
                </TableCell>
                <TableCell>{entry.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
