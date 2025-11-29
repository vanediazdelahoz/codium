"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Eye, Pencil, Trash2 } from "lucide-react"

type Evaluation = {
  id: string
  name: string
  openDate: string
  closeDate: string
  duration: string
}

export default function EvaluationsPage() {
  const [evaluations] = useState<Evaluation[]>([
    { id: "1", name: "Parcial Medio Término", openDate: "2024-06-10", closeDate: "2024-06-12", duration: "120 min" },
    { id: "2", name: "Evaluación Final", openDate: "2024-07-01", closeDate: "2024-07-03", duration: "180 min" },
    { id: "3", name: "Quiz Rápido", openDate: "2024-05-20", closeDate: "2024-05-20", duration: "30 min" },
  ])

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta evaluación?")) {
      console.log("Delete evaluation:", id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Evaluaciones / Parciales</h1>
          <p className="text-muted-foreground mt-2">Gestiona las evaluaciones formales</p>
        </div>
        <Link href="/dashboard/evaluations/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Crear Evaluación
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las Evaluaciones</CardTitle>
          <CardDescription>Evaluaciones y parciales creados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Fecha de Apertura</TableHead>
                <TableHead>Fecha de Cierre</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluations.map((evaluation) => (
                <TableRow key={evaluation.id}>
                  <TableCell className="font-medium">{evaluation.name}</TableCell>
                  <TableCell>{evaluation.openDate}</TableCell>
                  <TableCell>{evaluation.closeDate}</TableCell>
                  <TableCell>{evaluation.duration}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/evaluations/${evaluation.id}`}>
                        <Button variant="ghost" size="icon" title="Ver ranking">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/evaluations/${evaluation.id}/edit`}>
                        <Button variant="ghost" size="icon" title="Editar">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(evaluation.id)} title="Eliminar">
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
