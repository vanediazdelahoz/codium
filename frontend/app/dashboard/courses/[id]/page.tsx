"use client"

import { use, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, Pencil, Trash2, Users, ArrowLeft, Eye } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

type Group = {
  id: string
  name: string
  studentIds: string[]
  createdAt: string
}

type Student = {
  id: string
  name: string
}

const availableStudents: Student[] = [
  { id: "A00123456", name: "Juan Pérez" },
  { id: "A00123457", name: "María García" },
  { id: "A00123458", name: "Carlos López" },
  { id: "A00123459", name: "Ana Martínez" },
  { id: "A00123460", name: "Pedro Rodríguez" },
  { id: "A00123461", name: "Laura Sánchez" },
  { id: "A00123462", name: "Diego Torres" },
  { id: "A00123463", name: "Sofía Ramírez" },
]

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const course = {
    id,
    name: "Programación Avanzada",
    nrc: "12345",
  }

  const [groups, setGroups] = useState<Group[]>([
    { id: "1", name: "Grupo 1", studentIds: ["A00123456", "A00123457", "A00123458"], createdAt: "2024-01-15" },
    { id: "2", name: "Grupo 2", studentIds: ["A00123459", "A00123460"], createdAt: "2024-01-15" },
  ])

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [formData, setFormData] = useState({ studentIds: [] as string[] })
  const [searchQuery, setSearchQuery] = useState("")

  const filteredStudents = availableStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleStudent = (studentId: string) => {
    setFormData((prev) => ({
      ...prev,
      studentIds: prev.studentIds.includes(studentId)
        ? prev.studentIds.filter((id) => id !== studentId)
        : [...prev.studentIds, studentId],
    }))
  }

  const getNextGroupNumber = () => {
    if (groups.length === 0) return 1
    const numbers = groups.map((g) => Number.parseInt(g.name.replace("Grupo ", "")))
    return Math.max(...numbers) + 1
  }

  const renumberGroups = (groupList: Group[]) => {
    return groupList
      .sort((a, b) => Number.parseInt(a.name.replace("Grupo ", "")) - Number.parseInt(b.name.replace("Grupo ", "")))
      .map((group, index) => ({
        ...group,
        name: `Grupo ${index + 1}`,
      }))
  }

  const handleCreate = () => {
    const newGroup: Group = {
      id: Date.now().toString(),
      name: `Grupo ${getNextGroupNumber()}`,
      studentIds: formData.studentIds,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setGroups([...groups, newGroup])
    setIsCreateOpen(false)
    resetForm()
  }

  const handleEdit = (group: Group) => {
    setEditingGroup(group)
    setFormData({ studentIds: group.studentIds })
  }

  const handleUpdate = () => {
    if (editingGroup) {
      setGroups(groups.map((g) => (g.id === editingGroup.id ? { ...g, studentIds: formData.studentIds } : g)))
      setEditingGroup(null)
      resetForm()
    }
  }

  const handleDelete = (groupId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este grupo?")) {
      const updatedGroups = groups.filter((g) => g.id !== groupId)
      setGroups(renumberGroups(updatedGroups))
    }
  }

  const resetForm = () => {
    setFormData({ studentIds: [] })
    setSearchQuery("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/courses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-balance">{course.name}</h1>
          <p className="text-muted-foreground mt-2">NRC: {course.nrc}</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Crear Grupo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Grupo</DialogTitle>
              <DialogDescription>
                Selecciona los estudiantes del grupo (el nombre se asignará automáticamente)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Estudiantes ({formData.studentIds.length} seleccionados)</Label>
                <Input
                  placeholder="Buscar por nombre o ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <ScrollArea className="h-64 border rounded-md p-4">
                  <div className="space-y-3">
                    {filteredStudents.map((student) => (
                      <div key={student.id} className="flex items-center gap-3">
                        <Checkbox
                          id={`create-${student.id}`}
                          checked={formData.studentIds.includes(student.id)}
                          onCheckedChange={() => toggleStudent(student.id)}
                        />
                        <Label htmlFor={`create-${student.id}`} className="flex-1 cursor-pointer">
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.id}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
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
        {groups.map((group) => (
          <Card key={group.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="h-5 w-5" />
                {group.name}
              </CardTitle>
              <CardDescription>
                {group.studentIds.length} {group.studentIds.length === 1 ? "estudiante" : "estudiantes"}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex gap-2 justify-end pt-4 border-t mt-auto">
              <Link href={`/dashboard/courses/${course.id}/groups/${group.id}`}>
                <Button variant="ghost" size="icon" title="Ver grupo">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Dialog
                open={editingGroup?.id === group.id}
                onOpenChange={(open) => {
                  if (!open) {
                    setEditingGroup(null)
                    setSearchQuery("")
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(group)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Editar Grupo</DialogTitle>
                    <DialogDescription>Gestiona los estudiantes del grupo</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Estudiantes ({formData.studentIds.length} seleccionados)</Label>
                      <Input
                        placeholder="Buscar por nombre o ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <ScrollArea className="h-64 border rounded-md p-4">
                        <div className="space-y-3">
                          {filteredStudents.map((student) => (
                            <div key={student.id} className="flex items-center gap-3">
                              <Checkbox
                                id={`edit-${student.id}`}
                                checked={formData.studentIds.includes(student.id)}
                                onCheckedChange={() => toggleStudent(student.id)}
                              />
                              <Label htmlFor={`edit-${student.id}`} className="flex-1 cursor-pointer">
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-muted-foreground">{student.id}</div>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingGroup(null)
                        setSearchQuery("")
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleUpdate}>Actualizar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(group.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
