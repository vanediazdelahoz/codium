"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type TestCase = {
  caseId: number
  status: string
  timeMs: number
}

type Submission = {
  id: string
  studentName: string
  studentId: string
  language: "Python" | "C++" | "Java" | "Node.js"
  submittedAt: string
  status:
    | "ACCEPTED"
    | "WRONG_ANSWER"
    | "TIME_LIMIT_EXCEEDED"
    | "RUNTIME_ERROR"
    | "COMPILATION_ERROR"
    | "QUEUED"
    | "RUNNING"
  score: number
  executionTime: string
  testCases: TestCase[]
}

export function ChallengeSubmissions({ challengeId }: { challengeId: string }) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  const [submissions] = useState<Submission[]>([
    {
      id: "1",
      studentName: "Juan Pérez",
      studentId: "A00123456",
      language: "Python",
      submittedAt: "2024-06-15 14:30",
      status: "ACCEPTED",
      score: 100,
      executionTime: "0.45s",
      testCases: [
        { caseId: 1, status: "OK", timeMs: 40 },
        { caseId: 2, status: "OK", timeMs: 55 },
        { caseId: 3, status: "OK", timeMs: 38 },
        { caseId: 4, status: "OK", timeMs: 42 },
      ],
    },
    {
      id: "2",
      studentName: "María García",
      studentId: "A00123457",
      language: "C++",
      submittedAt: "2024-06-15 14:25",
      status: "WRONG_ANSWER",
      score: 60,
      executionTime: "0.32s",
      testCases: [
        { caseId: 1, status: "OK", timeMs: 30 },
        { caseId: 2, status: "WA", timeMs: 32 },
        { caseId: 3, status: "OK", timeMs: 28 },
        { caseId: 4, status: "WA", timeMs: 31 },
      ],
    },
    {
      id: "3",
      studentName: "Carlos López",
      studentId: "A00123458",
      language: "Java",
      submittedAt: "2024-06-15 14:20",
      status: "TIME_LIMIT_EXCEEDED",
      score: 40,
      executionTime: "1.50s",
      testCases: [
        { caseId: 1, status: "OK", timeMs: 45 },
        { caseId: 2, status: "TLE", timeMs: 1500 },
        { caseId: 3, status: "OK", timeMs: 50 },
        { caseId: 4, status: "TLE", timeMs: 1500 },
      ],
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
      case "OK":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "WRONG_ANSWER":
      case "WA":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "TIME_LIMIT_EXCEEDED":
      case "TLE":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "RUNTIME_ERROR":
      case "RE":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "COMPILATION_ERROR":
      case "CE":
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Submissions de Estudiantes</CardTitle>
        </CardHeader>
        <CardContent>
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
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.studentName}</TableCell>
                  <TableCell>{submission.studentId}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{submission.language}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{submission.submittedAt}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(submission.status)}>
                      {getStatusLabel(submission.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold">{submission.score}</span>
                    <span className="text-muted-foreground">/100</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{submission.executionTime}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedSubmission(submission)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalle de Submission</DialogTitle>
            <DialogDescription>
              {selectedSubmission?.studentName} ({selectedSubmission?.studentId})
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Lenguaje:</span>
                  <p className="font-medium">{selectedSubmission.language}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Fecha y Hora:</span>
                  <p className="font-medium">{selectedSubmission.submittedAt}</p>
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
                      {selectedSubmission.testCases.map((testCase) => (
                        <TableRow key={testCase.caseId}>
                          <TableCell className="font-medium">Caso {testCase.caseId}</TableCell>
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
