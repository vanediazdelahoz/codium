"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Database, Play, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type TestCase = {
  caseId: number
  input: string
  expectedOutput: string
  status?: "OK" | "WRONG_ANSWER" | "TLE" | "RE"
  actualOutput?: string
  timeMs?: number
}

type Submission = {
  id: string
  status: "QUEUED" | "RUNNING" | "ACCEPTED" | "WRONG_ANSWER" | "TLE" | "RE" | "CE"
  score: number
  timeMsTotal: number
  language: string
  submittedAt: string
  code: string
  cases: TestCase[]
}

export default function StudentChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string; challengeId: string }>
}) {
  const { id, challengeId } = use(params)
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "resolve" // "resolve" o "view"

  const challenge = {
    id: challengeId,
    title: "Algoritmo de Ordenamiento",
    description:
      "Implementa el algoritmo Quicksort para ordenar un arreglo de números enteros de forma ascendente. Tu función debe recibir un arreglo y retornar el arreglo ordenado.",
    difficulty: "Media",
    timeLimit: "1000",
    memoryLimit: "256",
    tags: ["Algoritmos", "Ordenamiento", "Recursión"],
  }

  const [language, setLanguage] = useState("python")
  const [code, setCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submission, setSubmission] = useState<Submission | null>(null)

  const testCases: TestCase[] = [
    { caseId: 1, input: "[5, 2, 8, 1, 9]", expectedOutput: "[1, 2, 5, 8, 9]" },
    { caseId: 2, input: "[3, 3, 1, 2]", expectedOutput: "[1, 2, 3, 3]" },
    { caseId: 3, input: "[10]", expectedOutput: "[10]" },
    { caseId: 4, input: "[]", expectedOutput: "[]" },
  ]

  const existingSubmission: Submission = {
    id: "sub-001",
    language: "Python",
    submittedAt: "2024-06-20 15:30:45",
    status: "ACCEPTED",
    score: 95,
    timeMsTotal: 720,
    code: `def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)`,
    cases: [
      {
        caseId: 1,
        input: "[5, 2, 8, 1, 9]",
        expectedOutput: "[1, 2, 5, 8, 9]",
        status: "OK",
        actualOutput: "[1, 2, 5, 8, 9]",
        timeMs: 40,
      },
      {
        caseId: 2,
        input: "[3, 3, 1, 2]",
        expectedOutput: "[1, 2, 3, 3]",
        status: "OK",
        actualOutput: "[1, 2, 3, 3]",
        timeMs: 55,
      },
      { caseId: 3, input: "[10]", expectedOutput: "[10]", status: "OK", actualOutput: "[10]", timeMs: 25 },
      {
        caseId: 4,
        input: "[]",
        expectedOutput: "[]",
        status: "WRONG_ANSWER",
        actualOutput: "null",
        timeMs: 30,
      },
    ],
  }

  const handleSubmitCode = () => {
    if (!code) return

    setIsSubmitting(true)

    setTimeout(() => {
      const passedCases = Math.floor(Math.random() * 4) + 1
      const isFullyAccepted = passedCases === 4

      const simulatedSubmission: Submission = {
        id: `subm-${Date.now()}`,
        status: isFullyAccepted ? "ACCEPTED" : passedCases >= 2 ? "WRONG_ANSWER" : "RE",
        score: Math.floor((passedCases / 4) * 100),
        timeMsTotal: Math.floor(Math.random() * 500) + 200,
        language: language.charAt(0).toUpperCase() + language.slice(1),
        submittedAt: new Date().toLocaleString("es-ES"),
        code: code,
        cases: testCases.map((tc, idx) => ({
          ...tc,
          status: idx < passedCases ? "OK" : "WRONG_ANSWER",
          actualOutput: idx < passedCases ? tc.expectedOutput : "[error]",
          timeMs: Math.floor(Math.random() * 100) + 20,
        })),
      }

      setSubmission(simulatedSubmission)
      setIsSubmitting(false)
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return <Badge className="bg-green-600">Aceptado</Badge>
      case "WRONG_ANSWER":
        return <Badge className="bg-red-600">Respuesta Incorrecta</Badge>
      case "TLE":
        return <Badge className="bg-orange-600">Tiempo Límite Excedido</Badge>
      case "RE":
        return <Badge className="bg-purple-600">Error de Ejecución</Badge>
      case "CE":
        return <Badge className="bg-gray-600">Error de Compilación</Badge>
      case "RUNNING":
        return <Badge className="bg-blue-600">Ejecutando</Badge>
      case "QUEUED":
        return <Badge className="bg-yellow-600">En Cola</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (mode === "view") {
    const displaySubmission = submission || existingSubmission

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/student/courses/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-balance">{challenge.title}</h1>
              <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                {challenge.difficulty}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-2">
              {challenge.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Límite: {challenge.timeLimit}ms</span>
              </div>
              <div className="flex items-center gap-1">
                <Database className="h-4 w-4" />
                <span>Memoria: {challenge.memoryLimit}MB</span>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Descripción</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{challenge.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tu Solución Enviada</CardTitle>
            <CardDescription>Detalles de tu submission más reciente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">ID Submission</p>
                <p className="text-lg font-mono font-semibold">{displaySubmission.id}</p>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(displaySubmission.status)}
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Puntaje</p>
                  <p className="text-2xl font-bold text-primary">{displaySubmission.score}/100</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tiempo Total</p>
                      <p className="text-xl font-bold">{displaySubmission.timeMsTotal}ms</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Lenguaje</p>
                      <p className="text-xl font-bold">{displaySubmission.language}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Play className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Enviado</p>
                      <p className="text-sm font-semibold">{displaySubmission.submittedAt}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Código Enviado</Label>
                <Badge variant="outline" className="font-mono text-xs">
                  {displaySubmission.language}
                </Badge>
              </div>
              <div className="bg-slate-950 text-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-inner">
                <pre className="font-mono text-sm overflow-x-auto leading-relaxed">{displaySubmission.code}</pre>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultados de los Casos de Prueba</CardTitle>
            <CardDescription>Detalles de la ejecución en cada caso de prueba</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Estado</TableHead>
                  <TableHead>Caso</TableHead>
                  <TableHead>Entrada</TableHead>
                  <TableHead>Salida Esperada</TableHead>
                  <TableHead>Tu Salida</TableHead>
                  <TableHead>Tiempo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displaySubmission.cases.map((test) => (
                  <TableRow key={test.caseId}>
                    <TableCell>
                      {test.status === "OK" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">#{test.caseId}</TableCell>
                    <TableCell className="font-mono text-sm">{test.input}</TableCell>
                    <TableCell className="font-mono text-sm">{test.expectedOutput}</TableCell>
                    <TableCell
                      className={`font-mono text-sm ${test.status === "OK" ? "text-green-600" : "text-red-600"}`}
                    >
                      {test.actualOutput}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{test.timeMs}ms</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Casos de Prueba de Ejemplo</CardTitle>
            <CardDescription>Ejemplos públicos de entradas y salidas esperadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testCases.slice(0, 2).map((tc, idx) => (
                <div key={tc.caseId} className="p-4 bg-muted rounded-lg space-y-2">
                  <p className="font-semibold text-sm">Caso {idx + 1}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Entrada:</span>
                      <p className="font-mono">{tc.input}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Salida Esperada:</span>
                      <p className="font-mono">{tc.expectedOutput}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/student/courses/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-balance">{challenge.title}</h1>
            <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-2">
            {challenge.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Límite: {challenge.timeLimit}ms</span>
            </div>
            <div className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              <span>Memoria: {challenge.memoryLimit}MB</span>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Descripción</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{challenge.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tu Solución</CardTitle>
          <CardDescription>Escribe tu código y envía tu solución</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Lenguaje de Programación</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="nodejs">Node.js</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="java">Java</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Código</Label>
            <Textarea
              id="code"
              placeholder="Escribe tu código aquí..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={15}
              className="font-mono text-sm"
            />
          </div>

          <Button onClick={handleSubmitCode} disabled={!code || isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando y Evaluando...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Enviar Solución
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Casos de Prueba de Ejemplo</CardTitle>
          <CardDescription>Ejemplos públicos de entradas y salidas esperadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testCases.slice(0, 2).map((tc, idx) => (
              <div key={tc.caseId} className="p-4 bg-muted rounded-lg space-y-2">
                <p className="font-semibold text-sm">Caso {idx + 1}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Entrada:</span>
                    <p className="font-mono">{tc.input}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Salida Esperada:</span>
                    <p className="font-mono">{tc.expectedOutput}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
