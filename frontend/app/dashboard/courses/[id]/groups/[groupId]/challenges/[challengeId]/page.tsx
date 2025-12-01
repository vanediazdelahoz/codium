"use client"

import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Code2, TestTube, Trophy, Clock, Database } from "lucide-react"
import { ChallengeSubmissions } from "@/components/challenge-submissions"
import { ChallengeTestCases } from "@/components/challenge-test-cases"
import { ChallengeLeaderboard } from "@/components/challenge-leaderboard"

export default function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string; groupId: string; challengeId: string }>
}) {
  const { id: courseId, groupId, challengeId } = use(params)

  const challenge = {
    id: challengeId,
    title: "Algoritmo de Ordenamiento",
    description:
      "Implementa el algoritmo de ordenamiento quicksort para ordenar un arreglo de enteros de manera eficiente.",
    difficulty: "Media",
    tags: ["Algoritmos", "Ordenamiento", "Recursión"],
    timeLimit: "1s",
    memoryLimit: "256MB",
    status: "Publicado",
  }

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/courses/${courseId}/groups/${groupId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-balance">{challenge.title}</h1>
            <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {challenge.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Descripción del Reto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{challenge.description}</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Límite de Tiempo</div>
                <div className="text-lg font-bold">{challenge.timeLimit}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Database className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Límite de Memoria</div>
                <div className="text-lg font-bold">{challenge.memoryLimit}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="submissions" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="submissions" className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            Submissions
          </TabsTrigger>
          <TabsTrigger value="testcases" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Casos de Prueba
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submissions">
          <ChallengeSubmissions challengeId={challengeId} />
        </TabsContent>

        <TabsContent value="testcases">
          <ChallengeTestCases challengeId={challengeId} />
        </TabsContent>

        <TabsContent value="leaderboard">
          <ChallengeLeaderboard challengeId={challengeId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
