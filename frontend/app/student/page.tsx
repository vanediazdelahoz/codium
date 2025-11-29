"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Trophy } from "lucide-react"

interface Course {
  id: string
  name: string
  nrc: string
  group: string
  professor: string
  totalChallenges: number
  completedChallenges: number
  rank: number
  totalStudents: number
}

export default function StudentDashboardPage() {
  const [courses] = useState<Course[]>([
    {
      id: "1",
      name: "Estructuras de Datos",
      nrc: "12345",
      group: "Grupo 1",
      professor: "Dr. Juan Pérez",
      totalChallenges: 12,
      completedChallenges: 8,
      rank: 5,
      totalStudents: 30,
    },
    {
      id: "2",
      name: "Algoritmos Avanzados",
      nrc: "12346",
      group: "Grupo 2",
      professor: "Dra. María García",
      totalChallenges: 10,
      completedChallenges: 6,
      rank: 12,
      totalStudents: 28,
    },
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Mis Cursos</h1>
        <p className="text-muted-foreground mt-2">Accede a tus cursos, retos, evaluaciones y leaderboards</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((course) => (
          <Link key={course.id} href={`/student/courses/${course.id}`}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">NRC: {course.nrc}</Badge>
                      <Badge variant="outline">{course.group}</Badge>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Profesor:</span> {course.professor}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-medium">
                      {course.completedChallenges}/{course.totalChallenges} retos
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{
                        width: `${(course.completedChallenges / course.totalChallenges) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">Estudiantes</p>
                      <p className="font-medium">{course.totalStudents}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">Tu Posición</p>
                      <p className="font-medium">#{course.rank}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
