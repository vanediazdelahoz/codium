"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Eye } from "lucide-react"

type Challenge = {
  id: string
  title: string
  difficulty: "Fácil" | "Medio" | "Difícil"
  deadline: string
  status: "Publicado" | "Borrador"
  lastModified?: string
}

export default function ChallengesPage() {
  const [challenges] = useState<Challenge[]>([
    { id: "1", title: "Algoritmo de Ordenamiento", difficulty: "Medio", deadline: "2024-06-15", status: "Publicado" },
    { id: "2", title: "Búsqueda Binaria", difficulty: "Fácil", deadline: "2024-06-20", status: "Publicado" },
    { id: "3", title: "Árbol de Decisión", difficulty: "Difícil", deadline: "2024-06-25", status: "Publicado" },
    {
      id: "4",
      title: "Lista Enlazada",
      difficulty: "Medio",
      deadline: "",
      status: "Borrador",
      lastModified: "2024-06-01",
    },
    {
      id: "5",
      title: "Hash Table",
      difficulty: "Difícil",
      deadline: "",
      status: "Borrador",
      lastModified: "2024-05-28",
    },
  ])

  const publishedChallenges = challenges.filter((c) => c.status === "Publicado")
  const draftChallenges = challenges.filter((c) => c.status === "Borrador")

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este reto?")) {
      console.log("Delete challenge:", id)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Medio":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Difícil":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Retos</h1>
          <p className="text-muted-foreground mt-2">Gestiona los retos de programación</p>
        </div>
        <Link href="/dashboard/challenges/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Crear Reto
          </Button>
        </Link>
      </div>

      {/* Published Challenges */}
      <Card>
        <CardHeader>
          <CardTitle>Retos Publicados</CardTitle>
          <CardDescription>Retos disponibles para los estudiantes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre del Reto</TableHead>
                <TableHead>Dificultad</TableHead>
                <TableHead>Fecha Límite</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publishedChallenges.map((challenge) => (
                <TableRow key={challenge.id}>
                  <TableCell>
                    <Link href={`/dashboard/challenges/${challenge.id}`} className="font-medium hover:underline">
                      {challenge.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>{challenge.deadline}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/challenges/${challenge.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/challenges/${challenge.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
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

      {/* Draft Challenges */}
      <Card>
        <CardHeader>
          <CardTitle>Retos en Borrador</CardTitle>
          <CardDescription>Retos no publicados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre del Reto</TableHead>
                <TableHead>Dificultad</TableHead>
                <TableHead>Última Modificación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {draftChallenges.map((challenge) => (
                <TableRow key={challenge.id}>
                  <TableCell className="font-medium">{challenge.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>{challenge.lastModified}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/challenges/${challenge.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
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
    </div>
  )
}
