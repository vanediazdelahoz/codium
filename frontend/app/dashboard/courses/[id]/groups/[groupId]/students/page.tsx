"use client"

import { use, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Search, UserPlus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Student = {
  id: string
  name: string
  studentId: string
  email: string
}

export default function GroupStudentsPage({
  params,
}: {
  params: Promise<{ id: string; groupId: string }>
}) {
  const { id: courseId, groupId } = use(params)

  const course = { id: courseId, name: "Programación Avanzada" }
  const group = { id: groupId, name: "Grupo 1" }

  const [groupStudents, setGroupStudents] = useState<Student[]>([
    { id: "1", name: "Juan Pérez", studentId: "A00123456", email: "juan@example.com" },
    { id: "2", name: "María García", studentId: "A00123457", email: "maria@example.com" },
  ])

  const [availableStudents] = useState<Student[]>([
    { id: "3", name: "Carlos López", studentId: "A00123458", email: "carlos@example.com" },
    { id: "4", name: "Ana Martínez", studentId: "A00123459", email: "ana@example.com" },
    { id: "5", name: "Pedro Sánchez", studentId: "A00123460", email: "pedro@example.com" },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)

  const filteredAvailableStudents = availableStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddStudent = (student: Student) => {
    setGroupStudents([...groupStudents, student])
    setIsAddOpen(false)
    setSearchQuery("")
  }

  const handleRemoveStudent = (studentId: string) => {
    if (confirm("¿Estás seguro de que deseas remover este estudiante del grupo?")) {
      setGroupStudents(groupStudents.filter((s) => s.id !== studentId))
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
          <h1 className="text-3xl font-bold text-balance">Estudiantes - {group.name}</h1>
          <p className="text-muted-foreground mt-2">{course.name}</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Agregar Estudiantes
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Estudiantes al Grupo</DialogTitle>
              <DialogDescription>Busca y selecciona estudiantes para agregar al grupo</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o código de estudiante..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead className="text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAvailableStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" onClick={() => handleAddStudent(student)}>
                            Agregar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudiantes</CardTitle>
          <CardDescription>
            <Badge variant="secondary">{groupStudents.length} estudiantes</Badge> inscritos en este grupo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Código de Estudiante</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveStudent(student.id)}>
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
