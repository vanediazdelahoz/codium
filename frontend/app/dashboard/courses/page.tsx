"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, Eye } from "lucide-react"
import { apiClient } from "@/lib/api-client"

type Course = {
  id: string
  name: string
  code: string
  professorId: string
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string>("")
  const [currentUserRole, setCurrentUserRole] = useState<string>("")

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [formData, setFormData] = useState({ name: "", code: "" })

  useEffect(() => {
    const loadUserAndCourses = async () => {
      setLoading(true)
      try {
        const me = await apiClient.authApi.me()
        setCurrentUserId(me.id)
        setCurrentUserRole(me.role)

        if (me.role !== "professor") {
          setError("No autorizado: Solo los profesores pueden acceder a esta vista")
          setCourses([])
          return
        }

        const allCourses = await apiClient.coursesApi.list()
        // Filtrar solo cursos del profesor
        const myCourses = allCourses.filter((c: any) => c.professorId === me.id)
        setCourses(myCourses)
      } catch (err: any) {
        setError(err.message || "Error al cargar cursos")
        setCourses([])
      } finally {
        setLoading(false)
      }
    }

    loadUserAndCourses()
  }, [])

  const handleCreate = async () => {
    try {
      const newCourse = await apiClient.coursesApi.create({
        name: formData.name,
        code: formData.code,
        professorId: currentUserId
      })
      setCourses([...courses, newCourse])
      setIsCreateOpen(false)
      resetForm()
    } catch (err: any) {
      alert(err.message || "Error al crear curso")
    }
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setFormData({ name: course.name, code: course.code })
  }

  const handleUpdate = async () => {
    if (!editingCourse) return
    try {
      const updated = await apiClient.coursesApi.update(editingCourse.id, formData)
      setCourses(courses.map((c) => (c.id === updated.id ? updated : c)))
      setEditingCourse(null)
      resetForm()
    } catch (err: any) {
      alert(err.message || "Error al actualizar curso")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este curso?")) return
    try {
      await apiClient.coursesApi.delete(id)
      setCourses(courses.filter((c) => c.id !== id))
    } catch (err: any) {
      alert(err.message || "Error al eliminar curso")
    }
  }

  const resetForm = () => setFormData({ name: "", code: "" })

  if (loading) return <p>Cargando cursos...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Cursos</h1>
          <p className="text-muted-foreground mt-2">Gestiona los cursos de tu plataforma</p>
        </div>

        {currentUserRole === "professor" && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Crear Curso
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Curso</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del curso</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Programación Avanzada"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">NRC</Label>
                  <Input
                    id="code"
                    placeholder="Ej: 12345"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreate}>Crear</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{course.name}</CardTitle>
              <CardDescription>NRC: {course.code}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1"></CardContent>
            <CardFooter className="flex gap-2 justify-end pt-4 border-t mt-auto">
              <Link href={`/dashboard/courses/${course.id}`}>
                <Button variant="ghost" size="icon" title="Ver grupos">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>

              {course.professorId === currentUserId && (
                <>
                  <Dialog open={editingCourse?.id === course.id} onOpenChange={(open) => !open && setEditingCourse(null)}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(course)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Curso</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Nombre del curso</Label>
                          <Input
                            id="edit-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-code">NRC</Label>
                          <Input
                            id="edit-code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingCourse(null)}>Cancelar</Button>
                        <Button onClick={handleUpdate}>Actualizar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button variant="ghost" size="icon" onClick={() => handleDelete(course.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
