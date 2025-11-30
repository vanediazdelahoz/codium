"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Loader2 } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"

interface Challenge {
  id: string
  title: string
  course?: string
  difficulty: "EASY" | "MEDIUM" | "HARD"
}

export default function StudentChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadChallenges()
  }, [])

  const loadChallenges = async () => {
    setIsLoading(true)
    try {
      const data = await apiClient.challengesApi.list()
      setChallenges(data || [])
    } catch (err) {
      console.error("Error loading challenges:", err)
    } finally {
      setIsLoading(false)
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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Retos Disponibles</h1>
        <p className="text-muted-foreground">Resuelve los retos de tus cursos inscritos</p>
      </div>

      {challenges.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No hay retos disponibles todavía</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge: any) => (
            <Link key={challenge.id} href={`/student/challenges/${challenge.id}`}>
              <Card className="p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-foreground flex-1">{challenge.title}</h3>
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {getDifficultyLabel(challenge.difficulty)}
                  </Badge>
                </div>

                <div className="space-y-2 flex-1">
                  {challenge.course && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium text-foreground">{challenge.course}</span>
                    </div>
                  )}
                  {challenge.createdAt && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Creado: {new Date(challenge.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
