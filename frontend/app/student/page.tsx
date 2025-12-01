"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Trophy, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface Course {
  id: string
  name: string
  description?: string
  professor?: string
}

interface CourseWithStats extends Course {
  completedChallenges: number
  totalChallenges: number
  rank: number
  totalStudents: number
}

export default function StudentDashboardPage() {
  const [courses, setCourses] = useState<CourseWithStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const courseList = await apiClient.coursesApi.list()
        
        // Cargar stats para cada curso
        const coursesWithStats = await Promise.all(
          courseList.map(async (course: Course) => {
            try {
              const leaderboard = await apiClient.leaderboardsApi.getCourseLeaderboard(course.id, 100)
              const userRank = leaderboard.findIndex((entry: any) => entry.userId) + 1 || 0
              
              return {
                ...course,
                completedChallenges: 0, // TODO: Calcular desde submissions
                totalChallenges: 0, // TODO: Obtener de challenges del curso
                rank: userRank,
                totalStudents: leaderboard.length,
              }
            } catch (err) {
              return {
                ...course,
                completedChallenges: 0,
                totalChallenges: 0,
                rank: 0,
                totalStudents: 0,
              }
            }
          })
        )
        
        setCourses(coursesWithStats)
      } catch (err) {
        console.error("Error loading courses:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Mis Cursos</h1>
        <p className="text-muted-foreground mt-2">Accede a tus cursos, retos, evaluaciones y leaderboards</p>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No estás inscrito en ningún curso todavía</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <Link key={course.id} href={`/student/courses/${course.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{course.name}</CardTitle>
                      {course.description && (
                        <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                      )}
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {course.professor && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Profesor:</span> {course.professor}
                    </div>
                  )}

                  {course.totalChallenges > 0 && (
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
                            width: `${
                              course.totalChallenges > 0
                                ? (course.completedChallenges / course.totalChallenges) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

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
                        <p className="font-medium">{course.rank > 0 ? `#${course.rank}` : "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
