"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"

type Challenge = {
  id: string
  title: string
  difficulty: string
}

export default function CreateEvaluationPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    openDate: "",
    openTime: "",
    closeDate: "",
    closeTime: "",
  })

  const [availableChallenges] = useState<Challenge[]>([
    { id: "1", title: "Algoritmo de Ordenamiento", difficulty: "Medio" },
    { id: "2", title: "Búsqueda Binaria", difficulty: "Fácil" },
    { id: "3", title: "Árbol de Decisión", difficulty: "Difícil" },
    { id: "4", title: "Lista Enlazada", difficulty: "Medio" },
    { id: "5", title: "Hash Table", difficulty: "Difícil" },
  ])

  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([])

  const toggleChallenge = (challengeId: string) => {
    setSelectedChallenges((prev) =>
      prev.includes(challengeId) ? prev.filter((id) => id !== challengeId) : [...prev, challengeId],
    )
  }

  const handleSave = () => {
    console.log("Save evaluation:", { ...formData, challenges: selectedChallenges })
    router.push("/dashboard/evaluations")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/evaluations">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-balance">Crear Nueva Evaluación</h1>
          <p className="text-muted-foreground mt-2">Configura una evaluación formal basada en retos</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
          <CardDescription>Detalles de la evaluación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la evaluación</Label>
            <Input
              id="name"
              placeholder="Ej: Parcial Medio Término"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duración (minutos)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="120"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="openDate">Fecha de inicio</Label>
              <Input
                id="openDate"
                type="date"
                value={formData.openDate}
                onChange={(e) => setFormData({ ...formData, openDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="openTime">Hora de inicio</Label>
              <Input
                id="openTime"
                type="time"
                value={formData.openTime}
                onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="closeDate">Fecha de cierre</Label>
              <Input
                id="closeDate"
                type="date"
                value={formData.closeDate}
                onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="closeTime">Hora de cierre</Label>
              <Input
                id="closeTime"
                type="time"
                value={formData.closeTime}
                onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Selección de Retos</CardTitle>
          <CardDescription>Elige los retos que formarán parte de esta evaluación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {availableChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={`challenge-${challenge.id}`}
                  checked={selectedChallenges.includes(challenge.id)}
                  onCheckedChange={() => toggleChallenge(challenge.id)}
                />
                <label
                  htmlFor={`challenge-${challenge.id}`}
                  className="flex-1 flex items-center justify-between cursor-pointer"
                >
                  <span className="font-medium">{challenge.title}</span>
                  <span className="text-sm text-muted-foreground">{challenge.difficulty}</span>
                </label>
              </div>
            ))}
          </div>
          {selectedChallenges.length > 0 && (
            <p className="text-sm text-muted-foreground mt-4">{selectedChallenges.length} reto(s) seleccionado(s)</p>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Link href="/dashboard/evaluations">
          <Button variant="outline">Cancelar</Button>
        </Link>
        <Button onClick={handleSave}>Guardar</Button>
      </div>
    </div>
  )
}
