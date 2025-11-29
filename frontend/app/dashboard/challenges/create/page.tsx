"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X, ArrowLeft } from "lucide-react"
import Link from "next/link"

type TestCase = {
  id: string
  name: string
  input: string
  expectedOutput: string
}

export default function CreateChallengePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "",
    timeLimit: "",
    status: "",
  })
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [courses, setCourses] = useState<string[]>([])
  const [testCases, setTestCases] = useState<TestCase[]>([])

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const addTestCase = () => {
    const newTestCase: TestCase = {
      id: Date.now().toString(),
      name: "",
      input: "",
      expectedOutput: "",
    }
    setTestCases([...testCases, newTestCase])
  }

  const updateTestCase = (id: string, field: keyof TestCase, value: string) => {
    setTestCases(testCases.map((tc) => (tc.id === id ? { ...tc, [field]: value } : tc)))
  }

  const removeTestCase = (id: string) => {
    setTestCases(testCases.filter((tc) => tc.id !== id))
  }

  const handleSave = (publish: boolean) => {
    console.log("Save challenge:", {
      ...formData,
      tags,
      courses,
      testCases,
      status: publish ? "Publicado" : "Borrador",
    })
    router.push("/dashboard/challenges")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/challenges">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-balance">Crear Nuevo Reto</h1>
          <p className="text-muted-foreground mt-2">Completa la información del reto</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
          <CardDescription>Detalles principales del reto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
              placeholder="Describe el reto en detalle..."
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Dificultad</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la dificultad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fácil">Fácil</SelectItem>
                  <SelectItem value="Medio">Medio</SelectItem>
                  <SelectItem value="Difícil">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeLimit">Límite de tiempo (minutos)</Label>
              <Input
                id="timeLimit"
                type="number"
                placeholder="60"
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Agregar tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="pl-3 pr-1">
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="courses">Asignar a cursos (NRC)</Label>
            <Input
              id="courses"
              placeholder="Ej: 12345, 12346"
              onChange={(e) => setCourses(e.target.value.split(",").map((c) => c.trim()))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Publicado">Publicado</SelectItem>
                <SelectItem value="Borrador">Borrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Casos de Prueba</CardTitle>
              <CardDescription>Define los casos de prueba para validar las soluciones</CardDescription>
            </div>
            <Button onClick={addTestCase} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Caso
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {testCases.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay casos de prueba. Haz clic en "Agregar Caso" para crear uno.
            </p>
          ) : (
            testCases.map((testCase, index) => (
              <Card key={testCase.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Caso de Prueba {index + 1}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => removeTestCase(testCase.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nombre del caso</Label>
                    <Input
                      placeholder="Ej: Caso básico"
                      value={testCase.name}
                      onChange={(e) => updateTestCase(testCase.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Entrada</Label>
                    <Textarea
                      placeholder="Código de entrada..."
                      rows={3}
                      value={testCase.input}
                      onChange={(e) => updateTestCase(testCase.id, "input", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Resultado Esperado</Label>
                    <Textarea
                      placeholder="Resultado esperado..."
                      rows={3}
                      value={testCase.expectedOutput}
                      onChange={(e) => updateTestCase(testCase.id, "expectedOutput", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Link href="/dashboard/challenges">
          <Button variant="outline">Cancelar</Button>
        </Link>
        <Button variant="secondary" onClick={() => handleSave(false)}>
          Guardar como Borrador
        </Button>
        <Button onClick={() => handleSave(true)}>Publicar</Button>
      </div>
    </div>
  )
}
