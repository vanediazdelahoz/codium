"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { apiClient } from "@/lib/api-client"

type TestCaseResult = {
  id: string
  status: "PASS" | "FAIL" | "TIMEOUT" | "RUNTIME_ERROR"
  timeMs: number
  output?: string
  error?: string
}

type Submission = {
  id: string
  user?: {
    id: string
    firstName: string
    lastName: string
  }
  userId?: string
  language: "PYTHON" | "JAVA" | "NODEJS" | "CPP"
  createdAt: string
  status: "ACCEPTED" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "RUNTIME_ERROR" | "COMPILATION_ERROR" | "QUEUED" | "RUNNING"
  score: number
  timeMsTotal: number
  results?: TestCaseResult[]
}

export function ChallengeSubmissions({ challengeId }: { challengeId: string }) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSubmissions()
  }, [challengeId])

  const loadSubmissions = async () => {
    setIsLoading(true)
    try {
      // TODO: Implementar endpoint para obtener submissions por challenge
      setSubmissions([])
    } catch (err) {
      console.error("Error loading submissions:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
      case "PASS":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "WRONG_ANSWER":
      case "FAIL":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "TIME_LIMIT_EXCEEDED":
      case "TIMEOUT":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "RUNTIME_ERROR":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "COMPILATION_ERROR":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
      case "QUEUED":
      case "RUNNING":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return ""
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "AC"
      case "WRONG_ANSWER":
        return "WA"
      case "TIME_LIMIT_EXCEEDED":
        return "TLE"
      case "RUNTIME_ERROR":
        return "RE"
      case "COMPILATION_ERROR":
        return "CE"
      default:
        return status
    }
  }

  const getLanguageLabel = (language: string) => {
    switch (language) {
      case "PYTHON":
        return "Python"
      case "JAVA":
        return "Java"
      case "NODEJS":
        return "Node.js"
      case "CPP":
        return "C++"
      default:
        return language
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Submissions de Estudiantes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay submissions todavía</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Lenguaje</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead className="min-w-[120px]">Estado</TableHead>
                  <TableHead>Puntaje</TableHead>
                  <TableHead>Tiempo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission: any) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      {submission.user
                        ? `${submission.user.firstName} ${submission.user.lastName}`
                        : "Usuario Desconocido"}
                    </TableCell>
                    <TableCell>{submission.userId?.substring(0, 8)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getLanguageLabel(submission.language)}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(submission.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(submission.status)}>
                        {getStatusLabel(submission.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold">{submission.score}</span>
                      <span className="text-muted-foreground">/100</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{submission.timeMsTotal}ms</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedSubmission(submission)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalle de Submission</DialogTitle>
            <DialogDescription>
              {selectedSubmission?.user
                ? `${selectedSubmission.user.firstName} ${selectedSubmission.user.lastName}`
                : "Usuario Desconocido"}
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Lenguaje:</span>
                  <p className="font-medium">{getLanguageLabel(selectedSubmission.language)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Fecha y Hora:</span>
                  <p className="font-medium">{new Date(selectedSubmission.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Estado:</span>
                  <div className="mt-1">
                    <Badge variant="outline" className={getStatusColor(selectedSubmission.status)}>
                      {getStatusLabel(selectedSubmission.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Puntaje:</span>
                  <p className="font-medium text-lg">{selectedSubmission.score}/100</p>
                </div>
              </div>

              {selectedSubmission.results && selectedSubmission.results.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Casos de Prueba Ejecutados</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Caso #</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Tiempo (ms)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedSubmission.results.map((testCase: any, index: number) => (
                          <TableRow key={testCase.id || index}>
                            <TableCell className="font-medium">Caso {index + 1}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(testCase.status)}>
                                {testCase.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{testCase.timeMs} ms</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
