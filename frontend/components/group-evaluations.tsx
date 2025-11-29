"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Pencil, Trash2 } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"

type Evaluation = {
  id: string
  name: string
  description: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  status: "Activa" | "Programada" | "Finalizada"
}

export function GroupEvaluations({ courseId, groupId }: { courseId: string; groupId: string }) {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([
    {
      id: "1",
      name: "Parcial Medio Término",
      description: "Evaluación de mitad de semestre sobre algoritmos y estructuras de datos",
      startDate: "2024-06-20",
      startTime: "14:00",
      endDate: "2024-06-20",
      endTime: "16:00",
      status: "Programada",
    },
    {
      id: "2",
      name: "Quiz Algoritmos",
      description: "Quiz rápido sobre complejidad algorítmica",
      startDate: "2024-06-10",
      startTime: "10:00",
      endDate: "2024-06-10",
      endTime: "11:00",
      status: "Finalizada",
    },
  ])

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingEvaluation, setEditingEvaluation] = useState<Evaluation | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    status: "Programada" as "Activa" | "Programada" | "Finalizada",
  })

  const handleCreate = () => {
    const newEvaluation: Evaluation = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate,
      startTime: formData.startTime,
      endDate: formData.endDate,
      endTime: formData.endTime,
      status: formData.status,
    }
    setEvaluations([...evaluations, newEvaluation])
    setIsCreateOpen(false)
    resetForm()
  }

  const handleEdit = (evaluation: Evaluation) => {
    setEditingEvaluation(evaluation)
    setFormData({
      name: evaluation.name,
      description: evaluation.description,
      startDate: evaluation.startDate,
      startTime: evaluation.startTime,
      endDate: evaluation.endDate,
      endTime: evaluation.endTime,
      status: evaluation.status,
    })
  }

  const handleUpdate = () => {
    if (editingEvaluation) {
      setEvaluations(
        evaluations.map((e) =>
          e.id === editingEvaluation.id
            ? {
                ...e,
                name: formData.name,
                description: formData.description,
                startDate: formData.startDate,
                startTime: formData.startTime,
                endDate: formData.endDate,
                endTime: formData.endTime,
                status: formData.status,
              }
            : e,
        ),
      )
      setEditingEvaluation(null)
      resetForm()
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta evaluación?")) {
      setEvaluations(evaluations.filter((e) => e.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      status: "Programada",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activa":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Programada":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Finalizada":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Evaluaciones del Grupo</CardTitle>
            <CardDescription>Gestiona las evaluaciones asignadas a este grupo</CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Evaluación
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nueva Evaluación</DialogTitle>
                <DialogDescription>Configura los detalles de la evaluación</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Parcial Medio Término"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe el contenido y objetivos de la evaluación"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Fecha de Inicio</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Hora de Inicio</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Fecha de Finalización</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Hora de Finalización</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </div>
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
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Inicio</TableHead>
              <TableHead>Finalización</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {evaluations.map((evaluation) => (
              <TableRow key={evaluation.id}>
                <TableCell className="font-medium">{evaluation.name}</TableCell>
                <TableCell className="text-sm">
                  {evaluation.startDate} {evaluation.startTime}
                </TableCell>
                <TableCell className="text-sm">
                  {evaluation.endDate} {evaluation.endTime}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(evaluation.status)}>
                    {evaluation.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/courses/${courseId}/groups/${groupId}/evaluations/${evaluation.id}`}>
                      <Button variant="ghost" size="icon" title="Ver detalle">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Dialog
                      open={editingEvaluation?.id === evaluation.id}
                      onOpenChange={(open) => !open && setEditingEvaluation(null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(evaluation)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Editar Evaluación</DialogTitle>
                          <DialogDescription>Actualiza los detalles de la evaluación</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-name">Nombre</Label>
                            <Input
                              id="edit-name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-description">Descripción</Label>
                            <Textarea
                              id="edit-description"
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-startDate">Fecha de Inicio</Label>
                              <Input
                                id="edit-startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-startTime">Hora de Inicio</Label>
                              <Input
                                id="edit-startTime"
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-endDate">Fecha de Finalización</Label>
                              <Input
                                id="edit-endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-endTime">Hora de Finalización</Label>
                              <Input
                                id="edit-endTime"
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingEvaluation(null)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleUpdate}>Actualizar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(evaluation.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
