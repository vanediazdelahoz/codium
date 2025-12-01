"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"

interface Course {
  id: number
  name: string
  nrc: string
  period: string
  group: string
  professor: string
  isEnrolled: boolean
}

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      name: "Estructuras de Datos",
      nrc: "12345",
      period: "2024-1",
      group: "A",
      professor: "Dr. Juan Pérez",
      isEnrolled: true,
    },
    {
      id: 2,
      name: "Algoritmos Avanzados",
      nrc: "12346",
      period: "2024-1",
      group: "B",
      professor: "Dra. María García",
      isEnrolled: false,
    },
    {
      id: 3,
      name: "Programación Orientada a Objetos",
      nrc: "12347",
      period: "2024-1",
      group: "C",
      professor: "Ing. Carlos López",
      isEnrolled: true,
    },
    {
      id: 4,
      name: "Bases de Datos",
      nrc: "12348",
      period: "2024-1",
      group: "A",
      professor: "Dra. Ana Martínez",
      isEnrolled: false,
    },
  ])

  const toggleEnrollment = (courseId: number) => {
    setCourses(
      courses.map((course) => (course.id === courseId ? { ...course, isEnrolled: !course.isEnrolled } : course)),
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Mis Cursos</h1>
        <p className="text-muted-foreground">Administra tus inscripciones a los cursos disponibles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="p-6 flex flex-col gap-4 relative hover:shadow-lg transition-shadow">
            {course.isEnrolled && (
              <Badge className="absolute top-4 right-4 bg-green-500/10 text-green-700 border-green-500/20">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Inscrito
              </Badge>
            )}

            <div className="space-y-3 flex-1">
              <h3 className="text-lg font-semibold text-foreground pr-20">{course.name}</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">NRC:</span>
                  <span className="font-medium">{course.nrc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Periodo:</span>
                  <span className="font-medium">{course.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Grupo:</span>
                  <span className="font-medium">{course.group}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profesor:</span>
                  <span className="font-medium">{course.professor}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => toggleEnrollment(course.id)}
              variant={course.isEnrolled ? "outline" : "default"}
              className={course.isEnrolled ? "text-destructive hover:bg-destructive/10" : ""}
            >
              {course.isEnrolled ? "Anular inscripción" : "Inscribirse"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
