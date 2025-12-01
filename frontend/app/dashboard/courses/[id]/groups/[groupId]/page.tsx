"use client"

import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Target, FileText, Trophy } from "lucide-react"
import { GroupChallenges } from "@/components/group-challenges"
import { GroupEvaluations } from "@/components/group-evaluations"
import { GroupLeaderboard } from "@/components/group-leaderboard"

export default function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string; groupId: string }>
}) {
  const { id: courseId, groupId } = use(params)

  const course = { id: courseId, name: "Programación Avanzada", nrc: "12345" }
  const group = { id: groupId, name: "Grupo 1", studentCount: 25 }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/courses/${courseId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-balance">{group.name}</h1>
          <p className="text-muted-foreground mt-2">
            {course.name} - NRC: {course.nrc}
          </p>
        </div>
      </div>

      <Tabs defaultValue="challenges" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Retos
          </TabsTrigger>
          <TabsTrigger value="evaluations" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Evaluaciones
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges">
          <GroupChallenges courseId={courseId} groupId={groupId} isInEvaluation={false} />
        </TabsContent>

        <TabsContent value="evaluations">
          <GroupEvaluations courseId={courseId} groupId={groupId} />
        </TabsContent>

        <TabsContent value="leaderboard">
          <GroupLeaderboard courseId={courseId} groupId={groupId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
