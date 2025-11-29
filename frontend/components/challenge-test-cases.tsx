"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"

type TestCase = {
  id: string
  input: string
  expectedOutput: string
  isPublic: boolean
  points: number
}

export function ChallengeTestCases({ challengeId }: { challengeId: string }) {
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: "1", input: "[5, 2, 8, 1, 9]", expectedOutput: "[1, 2, 5, 8, 9]", isPublic: true, points: 20 },
    { id: "2", input: "[3, 1, 4, 1, 5]", expectedOutput: "[1, 1, 3, 4, 5]", isPublic: true, points: 20 },
    { id: "3", input: "[100, 50, 25, 75]", expectedOutput: "[25, 50, 75, 100]", isPublic: false, points: 30 },
  ])

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTestCase, setEditingTestCase] = useState<TestCase | null>(null)
  const [formData, setFormData] = useState({
    input: "",
    expectedOutput: "",
    isPublic: true,
    points: 0,
  })

  const handleCreate = () => {
    const newTestCase: TestCase = {
      id: Date.now().toString(),
      ...formData,
    }
    setTestCases([...testCases, newTestCase])
    setIsCreateOpen(false)
    resetForm()
  }

  const handleEdit = (testCase: TestCase) => {
    setEditingTestCase(testCase)
    setFormData({
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      isPublic: testCase.isPublic,
      points: testCase.points,
    })
  }

  const handleUpdate = () => {
    if (editingTestCase) {
      setTestCases(
        testCases.map((tc) =>
          tc.id === editingTestCase.id
            ? {
                ...tc,
                input: formData.input,
                expectedOutput: formData.expectedOutput,
                isPublic: formData.isPublic,
                points: formData.points,
              }
            : tc,
        ),
      )
      setEditingTestCase(null)
      resetForm()
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este caso de prueba?")) {
      setTestCases(testCases.filter((tc) => tc.id !== id))
    }
  }

  const toggleVisibility = (id: string) => {
    setTestCases(testCases.map((tc) => (tc.id === id ? { ...tc, isPublic: !tc.isPublic } : tc)))
  }

  const resetForm = () => {
    setFormData({ input: "", expectedOutput: "", isPublic: true, points: 0 })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Casos de Prueba</CardTitle>
            <CardDescription>
              Define los casos de prueba para evaluar las submissions de los estudiantes
            </CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Caso
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Caso de Prueba</DialogTitle>
                <DialogDescription>Define la entrada y salida esperada</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="input">Entrada</Label>
                  <Textarea
                    id="input"
                    placeholder="Entrada del caso de prueba..."
                    value={formData.input}
                    onChange={(e) => setFormData({ ...formData, input: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="output">Salida Esperada</Label>
                  <Textarea
                    id="output"
                    placeholder="Salida esperada..."
                    value={formData.expectedOutput}
                    onChange={(e) => setFormData({ ...formData, expectedOutput: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="public">Visible para estudiantes</Label>
                  <Switch
                    id="public"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points">Puntos</Label>
                  <Input
                    id="points"
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: Number.parseInt(e.target.value) })}
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
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Caso #</TableHead>
              <TableHead>Entrada</TableHead>
              <TableHead>Salida Esperada</TableHead>
              <TableHead>Visibilidad</TableHead>
              <TableHead>Puntos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testCases.map((testCase, index) => (
              <TableRow key={testCase.id}>
                <TableCell className="font-medium">#{index + 1}</TableCell>
                <TableCell className="max-w-xs truncate font-mono text-sm">{testCase.input}</TableCell>
                <TableCell className="max-w-xs truncate font-mono text-sm">{testCase.expectedOutput}</TableCell>
                <TableCell>
                  <Badge variant={testCase.isPublic ? "default" : "secondary"}>
                    {testCase.isPublic ? "Público" : "Oculto"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{testCase.points} pts</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => toggleVisibility(testCase.id)}>
                      {testCase.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Dialog
                      open={editingTestCase?.id === testCase.id}
                      onOpenChange={(open) => !open && setEditingTestCase(null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(testCase)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Editar Caso de Prueba</DialogTitle>
                          <DialogDescription>Actualiza la entrada y salida esperada</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-input">Entrada</Label>
                            <Textarea
                              id="edit-input"
                              value={formData.input}
                              onChange={(e) => setFormData({ ...formData, input: e.target.value })}
                              rows={4}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-output">Salida Esperada</Label>
                            <Textarea
                              id="edit-output"
                              value={formData.expectedOutput}
                              onChange={(e) => setFormData({ ...formData, expectedOutput: e.target.value })}
                              rows={4}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="edit-public">Visible para estudiantes</Label>
                            <Switch
                              id="edit-public"
                              checked={formData.isPublic}
                              onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-points">Puntos</Label>
                            <Input
                              id="edit-points"
                              type="number"
                              value={formData.points}
                              onChange={(e) => setFormData({ ...formData, points: Number.parseInt(e.target.value) })}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingTestCase(null)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleUpdate}>Actualizar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(testCase.id)}>
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
