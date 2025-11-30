"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Pencil, Trash2, Loader2 } from "lucide-react"
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
import { apiClient } from "@/lib/api-client"

type Evaluation = {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  status: "DRAFT" | "PUBLISHED" | "CLOSED"
}

export function GroupEvaluations({ courseId, groupId }: { courseId: string; groupId: string }) {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingEvaluation, setEditingEvaluation] = useState<Evaluation | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED" | "CLOSED",
  })

  useEffect(() => {
    loadEvaluations()
  }, [groupId])

  const loadEvaluations = async () => {
    setIsLoading(true)
    try {
      const data = await apiClient.evaluationsApi.list(groupId)
      setEvaluations(data || [])
    } catch (err) {
      console.error("Error loading evaluations:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    setIsSubmitting(true)
    try {
      // TODO: Implementar creación en backend
      const newEvaluation: Evaluation = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
      }
      setEvaluations([...evaluations, newEvaluation])
      setIsCreateOpen(false)
      resetForm()
    } catch (err) {
      console.error("Error creating evaluation:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (evaluation: Evaluation) => {
    setEditingEvaluation(evaluation)
    setFormData({
      name: evaluation.name,
      description: evaluation.description || "",
      startDate: evaluation.startDate,
      endDate: evaluation.endDate,
      status: evaluation.status,
    })
  }

  const handleUpdate = async () => {
    if (!editingEvaluation) return
    setIsSubmitting(true)
    try {
      // TODO: Implementar actualización en backend
      setEvaluations(
        evaluations.map((e) =>
          e.id === editingEvaluation.id
            ? {
                ...e,
                name: formData.name,
                description: formData.description,
                startDate: formData.startDate,
                endDate: formData.endDate,
                status: formData.status,
              }
            : e,
        ),
      )
      setEditingEvaluation(null)
      resetForm()
    } catch (err) {
      console.error("Error updating evaluation:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta evaluación?")) return
    try {
      // TODO: Implementar eliminación en backend
      setEvaluations(evaluations.filter((e) => e.id !== id))
    } catch (err) {
      console.error("Error deleting evaluation:", err)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "DRAFT",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "DRAFT":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "CLOSED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      default:
        return ""
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "Activa"
      case "DRAFT":
        return "Programada"
      case "CLOSED":
        return "Finalizada"
      default:
        return status
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
                    onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe el contenido y objetivos de la evaluación"
                    value={formData.description}
                    onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Fecha de Inicio</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e: any) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Fecha de Finalización</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e: any) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Crear
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
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
              {evaluations.map((evaluation: any) => (
                <TableRow key={evaluation.id}>
                  <TableCell className="font-medium">{evaluation.name}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(evaluation.startDate).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(evaluation.endDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(evaluation.status)}>
                      {getStatusLabel(evaluation.status)}
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
                        onOpenChange={(open: any) => !open && setEditingEvaluation(null)}
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
                                onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-description">Descripción</Label>
                              <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-startDate">Fecha de Inicio</Label>
                                <Input
                                  id="edit-startDate"
                                  type="datetime-local"
                                  value={formData.startDate}
                                  onChange={(e: any) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-endDate">Fecha de Finalización</Label>
                                <Input
                                  id="edit-endDate"
                                  type="datetime-local"
                                  value={formData.endDate}
                                  onChange={(e: any) => setFormData({ ...formData, endDate: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingEvaluation(null)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleUpdate} disabled={isSubmitting}>
                              {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                              Actualizar
                            </Button>
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
        )}
      </CardContent>
    </Card>
  )
}
