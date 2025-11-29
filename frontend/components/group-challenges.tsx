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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Challenge = {
  id: string
  title: string
  description: string
  difficulty: "Fácil" | "Media" | "Difícil"
  tags: string[]
  timeLimit: string
  memoryLimit: string
  status: "Borrador" | "Publicado" | "Archivado"
  submissions: number
}

export function GroupChallenges({
  courseId,
  groupId,
  isInEvaluation,
}: { courseId: string; groupId: string; isInEvaluation?: boolean }) {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "1",
      title: "Algoritmo de Ordenamiento",
      description: "Implementa quicksort",
      difficulty: "Media",
      tags: ["Algoritmos", "Ordenamiento"],
      timeLimit: "1s",
      memoryLimit: "256MB",
      status: "Publicado",
      submissions: 45,
    },
    {
      id: "2",
      title: "Búsqueda Binaria",
      description: "Encuentra un elemento en un arreglo ordenado",
      difficulty: "Fácil",
      tags: ["Búsqueda"],
      timeLimit: "1s",
      memoryLimit: "128MB",
      status: "Publicado",
      submissions: 52,
    },
  ])

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Media" as "Fácil" | "Media" | "Difícil",
    tags: "",
    timeLimit: "1s",
    memoryLimit: "256MB",
    status: "Borrador" as "Borrador" | "Publicado" | "Archivado",
  })

  const handleCreate = () => {
    const newChallenge: Challenge = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      difficulty: formData.difficulty,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      timeLimit: formData.timeLimit,
      memoryLimit: formData.memoryLimit,
      status: formData.status,
      submissions: 0,
    }
    setChallenges([...challenges, newChallenge])
    setIsCreateOpen(false)
    resetForm()
  }

  const handleEdit = (challenge: Challenge) => {
    setEditingChallenge(challenge)
    setFormData({
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      tags: challenge.tags.join(", "),
      timeLimit: challenge.timeLimit,
      memoryLimit: challenge.memoryLimit,
      status: challenge.status,
    })
  }

  const handleUpdate = () => {
    if (editingChallenge) {
      setChallenges(
        challenges.map((c) =>
          c.id === editingChallenge.id
            ? {
                ...c,
                title: formData.title,
                description: formData.description,
                difficulty: formData.difficulty,
                tags: formData.tags.split(",").map((tag) => tag.trim()),
                timeLimit: formData.timeLimit,
                memoryLimit: formData.memoryLimit,
                status: formData.status,
              }
            : c,
        ),
      )
      setEditingChallenge(null)
      resetForm()
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este reto?")) {
      setChallenges(challenges.filter((c) => c.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      difficulty: "Media",
      tags: "",
      timeLimit: "1s",
      memoryLimit: "256MB",
      status: "Borrador",
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Media":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Difícil":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return ""
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Publicado":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Borrador":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "Archivado":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{isInEvaluation ? "Retos de la Evaluación" : "Retos del Grupo"}</CardTitle>
            <CardDescription>
              {isInEvaluation
                ? "Gestiona los retos asignados a esta evaluación"
                : "Gestiona los retos asignados a este grupo"}
            </CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Reto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Reto</DialogTitle>
                <DialogDescription>Completa la información del reto</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    placeholder="Ej: Algoritmo de Ordenamiento"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe el reto..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Dificultad</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value: any) => setFormData({ ...formData, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fácil">Fácil</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Difícil">Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Borrador">Borrador</SelectItem>
                        <SelectItem value="Publicado">Publicado</SelectItem>
                        <SelectItem value="Archivado">Archivado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
                  <Input
                    id="tags"
                    placeholder="Ej: Algoritmos, Ordenamiento"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeLimit">Límite de Tiempo</Label>
                    <Input
                      id="timeLimit"
                      placeholder="Ej: 1s"
                      value={formData.timeLimit}
                      onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memoryLimit">Límite de Memoria</Label>
                    <Input
                      id="memoryLimit"
                      placeholder="Ej: 256MB"
                      value={formData.memoryLimit}
                      onChange={(e) => setFormData({ ...formData, memoryLimit: e.target.value })}
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
              <TableHead>Título</TableHead>
              <TableHead>Dificultad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Límites</TableHead>
              <TableHead>Submissions</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {challenges.map((challenge) => (
              <TableRow key={challenge.id}>
                <TableCell>
                  <div>
                    <Link
                      href={`/dashboard/courses/${courseId}/groups/${groupId}/challenges/${challenge.id}`}
                      className="font-medium hover:underline"
                    >
                      {challenge.title}
                    </Link>
                    <div className="flex gap-1 mt-1">
                      {challenge.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(challenge.status)}>
                    {challenge.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <div>Tiempo: {challenge.timeLimit}</div>
                  <div>Memoria: {challenge.memoryLimit}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{challenge.submissions}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/courses/${courseId}/groups/${groupId}/challenges/${challenge.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Dialog
                      open={editingChallenge?.id === challenge.id}
                      onOpenChange={(open) => !open && setEditingChallenge(null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(challenge)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Editar Reto</DialogTitle>
                          <DialogDescription>Actualiza la información del reto</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-title">Título</Label>
                            <Input
                              id="edit-title"
                              value={formData.title}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-description">Descripción</Label>
                            <Textarea
                              id="edit-description"
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              rows={4}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-difficulty">Dificultad</Label>
                              <Select
                                value={formData.difficulty}
                                onValueChange={(value: any) => setFormData({ ...formData, difficulty: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Fácil">Fácil</SelectItem>
                                  <SelectItem value="Media">Media</SelectItem>
                                  <SelectItem value="Difícil">Difícil</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-status">Estado</Label>
                              <Select
                                value={formData.status}
                                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Borrador">Borrador</SelectItem>
                                  <SelectItem value="Publicado">Publicado</SelectItem>
                                  <SelectItem value="Archivado">Archivado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-tags">Etiquetas (separadas por comas)</Label>
                            <Input
                              id="edit-tags"
                              value={formData.tags}
                              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-timeLimit">Límite de Tiempo</Label>
                              <Input
                                id="edit-timeLimit"
                                value={formData.timeLimit}
                                onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-memoryLimit">Límite de Memoria</Label>
                              <Input
                                id="edit-memoryLimit"
                                value={formData.memoryLimit}
                                onChange={(e) => setFormData({ ...formData, memoryLimit: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingChallenge(null)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleUpdate}>Actualizar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(challenge.id)}>
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
