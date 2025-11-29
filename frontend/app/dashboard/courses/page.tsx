"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, Eye } from "lucide-react"

type Course = {
  id: string
  name: string
  nrc: string
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "Programación Avanzada", nrc: "12345" },
    { id: "2", name: "Estructuras de Datos", nrc: "12346" },
    { id: "3", name: "Algoritmos", nrc: "12347" },
  ])

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    nrc: "",
  })

  const handleCreate = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: formData.name,
      nrc: formData.nrc,
    }
    setCourses([...courses, newCourse])
    setIsCreateOpen(false)
    resetForm()
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      name: course.name,
      nrc: course.nrc,
    })
  }

  const handleUpdate = () => {
    if (editingCourse) {
      setCourses(
        courses.map((c) =>
          c.id === editingCourse.id
            ? {
                ...c,
                name: formData.name,
                nrc: formData.nrc,
              }
            : c,
        ),
      )
      setEditingCourse(null)
      resetForm()
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este curso?")) {
      setCourses(courses.filter((c) => c.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({ name: "", nrc: "" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Cursos</h1>
          <p className="text-muted-foreground mt-2">Gestiona los cursos de tu plataforma</p>
        </div>
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
              <DialogDescription>Completa la información del curso</DialogDescription>
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
                <Label htmlFor="nrc">NRC</Label>
                <Input
                  id="nrc"
                  placeholder="Ej: 12345"
                  value={formData.nrc}
                  onChange={(e) => setFormData({ ...formData, nrc: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate}>Crear</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{course.name}</CardTitle>
              <CardDescription>NRC: {course.nrc}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1"></CardContent>
            <CardFooter className="flex gap-2 justify-end pt-4 border-t mt-auto">
              <Link href={`/dashboard/courses/${course.id}`}>
                <Button variant="ghost" size="icon" title="Ver grupos">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Dialog open={editingCourse?.id === course.id} onOpenChange={(open) => !open && setEditingCourse(null)}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(course)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Curso</DialogTitle>
                    <DialogDescription>Actualiza la información del curso</DialogDescription>
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
                      <Label htmlFor="edit-nrc">NRC</Label>
                      <Input
                        id="edit-nrc"
                        value={formData.nrc}
                        onChange={(e) => setFormData({ ...formData, nrc: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditingCourse(null)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleUpdate}>Actualizar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(course.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
