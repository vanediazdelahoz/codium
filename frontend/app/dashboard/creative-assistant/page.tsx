"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Lightbulb, TestTube } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function CreativeAssistantPage() {
  const [topic, setTopic] = useState("")
  const [generatedIdeas, setGeneratedIdeas] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateIdeas = () => {
    setIsGenerating(true)
    // Simulación de generación con IA
    setTimeout(() => {
      setGeneratedIdeas([
        {
          id: 1,
          title: "Implementación de Árbol Binario de Búsqueda",
          description:
            "Implementa un árbol binario de búsqueda con operaciones de inserción, búsqueda y eliminación. El árbol debe mantener su propiedad de orden.",
          input: "Lista de números enteros a insertar",
          output: "Árbol binario resultante en formato de recorrido in-orden",
          difficulty: "Media",
          examples: [
            {
              input: "[5, 3, 7, 1, 9]",
              output: "[1, 3, 5, 7, 9]",
            },
          ],
        },
        {
          id: 2,
          title: "Verificación de Árbol Binario Balanceado",
          description:
            "Dado un árbol binario, determina si está balanceado. Un árbol está balanceado si la diferencia de altura entre sus subárboles izquierdo y derecho no excede 1.",
          input: "Representación del árbol en formato array",
          output: "Booleano indicando si el árbol está balanceado",
          difficulty: "Fácil",
          examples: [
            {
              input: "[1, 2, 3, 4, 5]",
              output: "true",
            },
          ],
        },
      ])
      setIsGenerating(false)
    }, 2000)
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          Asistente Creativo
        </h1>
        <p className="text-muted-foreground mt-2">
          Genera ideas de retos y casos de prueba utilizando inteligencia artificial
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Generación de Ideas de Retos
          </CardTitle>
          <CardDescription>
            Ingresa un tema y la IA generará ideas de retos con descripciones, entradas y salidas esperadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Tema del Reto</Label>
            <Input
              id="topic"
              placeholder="Ej: Árboles binarios, Búsqueda binaria, Algoritmos de ordenamiento"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <Button onClick={handleGenerateIdeas} disabled={!topic || isGenerating} className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? "Generando ideas..." : "Generar Ideas"}
          </Button>
        </CardContent>
      </Card>

      {generatedIdeas.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Ideas Generadas</h2>
          {generatedIdeas.map((idea) => (
            <Card key={idea.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{idea.title}</CardTitle>
                    <CardDescription className="mt-2">{idea.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className={getDifficultyColor(idea.difficulty)}>
                    {idea.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Entrada Esperada</Label>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm">{idea.input}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Salida Esperada</Label>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm">{idea.output}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <TestTube className="h-4 w-4" />
                    Ejemplos de Casos de Prueba
                  </Label>
                  {idea.examples.map((example: any, index: number) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-md space-y-1">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">Input:</span>
                          <p className="text-sm font-mono">{example.input}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">Output:</span>
                          <p className="text-sm font-mono">{example.output}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
