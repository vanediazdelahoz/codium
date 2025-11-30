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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiClient } from "@/lib/api-client"

type Challenge = {
  id: string
  title: string
  description: string
  difficulty: "EASY" | "MEDIUM" | "HARD"
  tags: string[]
  timeLimit: number
  memoryLimit: number
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  submissions?: number
}

export function GroupChallenges({
  courseId,
  groupId,
  isInEvaluation,
}: { courseId: string; groupId: string; isInEvaluation?: boolean }) {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "MEDIUM" as "EASY" | "MEDIUM" | "HARD",
    tags: "",
    timeLimit: "1000",
    memoryLimit: "256",
    status: "DRAFT" as "DRAFT" | "PUBLISHED" | "ARCHIVED",
  })

  useEffect(() => {
    loadChallenges()
  }, [groupId])

  const loadChallenges = async () => {
    setIsLoading(true)
    try {
      const data = await apiClient.challengesApi.list(groupId)
      setChallenges(data || [])
    } catch (err) {
      console.error("Error loading challenges:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    const newChallenge: Challenge = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      difficulty: formData.difficulty,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      timeLimit: parseInt(formData.timeLimit),
      memoryLimit: parseInt(formData.memoryLimit),
      status: formData.status,
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
      timeLimit: challenge.timeLimit.toString(),
      memoryLimit: challenge.memoryLimit.toString(),
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
                timeLimit: parseInt(formData.timeLimit),
                memoryLimit: parseInt(formData.memoryLimit),
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
      difficulty: "MEDIUM",
      tags: "",
      timeLimit: "1000",
      memoryLimit: "256",
      status: "DRAFT",
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "HARD":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return ""
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "DRAFT":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "ARCHIVED":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return ""
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "Fácil"
      case "MEDIUM":
        return "Media"
      case "HARD":
        return "Difícil"
      default:
        return difficulty
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "Publicado"
      case "DRAFT":
        return "Borrador"
      case "ARCHIVED":
        return "Archivado"
      default:
        return status
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
                    onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe el reto..."
                    value={formData.description}
                    onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
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
                        <SelectItem value="EASY">Fácil</SelectItem>
                        <SelectItem value="MEDIUM">Media</SelectItem>
                        <SelectItem value="HARD">Difícil</SelectItem>
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
                        <SelectItem value="DRAFT">Borrador</SelectItem>
                        <SelectItem value="PUBLISHED">Publicado</SelectItem>
                        <SelectItem value="ARCHIVED">Archivado</SelectItem>
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
                    onChange={(e: any) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeLimit">Límite de Tiempo (ms)</Label>
                    <Input
                      id="timeLimit"
                      placeholder="Ej: 1000"
                      value={formData.timeLimit}
                      onChange={(e: any) => setFormData({ ...formData, timeLimit: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memoryLimit">Límite de Memoria (MB)</Label>
                    <Input
                      id="memoryLimit"
                      placeholder="Ej: 256"
                      value={formData.memoryLimit}
                      onChange={(e: any) => setFormData({ ...formData, memoryLimit: e.target.value })}
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
                <TableHead>Título</TableHead>
                <TableHead>Dificultad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Límites</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {challenges.map((challenge: any) => (
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
                        {challenge.tags?.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                      {getDifficultyLabel(challenge.difficulty)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(challenge.status)}>
                      {getStatusLabel(challenge.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div>Tiempo: {challenge.timeLimit}ms</div>
                    <div>Memoria: {challenge.memoryLimit}MB</div>
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
                                onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-description">Descripción</Label>
                              <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
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
                                    <SelectItem value="EASY">Fácil</SelectItem>
                                    <SelectItem value="MEDIUM">Media</SelectItem>
                                    <SelectItem value="HARD">Difícil</SelectItem>
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
                                    <SelectItem value="DRAFT">Borrador</SelectItem>
                                    <SelectItem value="PUBLISHED">Publicado</SelectItem>
                                    <SelectItem value="ARCHIVED">Archivado</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-tags">Etiquetas (separadas por comas)</Label>
                              <Input
                                id="edit-tags"
                                value={formData.tags}
                                onChange={(e: any) => setFormData({ ...formData, tags: e.target.value })}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-timeLimit">Límite de Tiempo (ms)</Label>
                                <Input
                                  id="edit-timeLimit"
                                  value={formData.timeLimit}
                                  onChange={(e: any) => setFormData({ ...formData, timeLimit: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-memoryLimit">Límite de Memoria (MB)</Label>
                                <Input
                                  id="edit-memoryLimit"
                                  value={formData.memoryLimit}
                                  onChange={(e: any) => setFormData({ ...formData, memoryLimit: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingChallenge(null)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleUpdate} disabled={isSubmitting}>
                              {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                              Actualizar
                            </Button>
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
        )}
      </CardContent>
    </Card>
  )
}
