"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, TrendingUp, AlertTriangle, Clock, Search, Activity, CheckCircle2, XCircle } from "lucide-react"

// Mock data for logs
const logs = [
  {
    id: "SUB-001",
    event: "Creación del submission",
    timestamp: "2025-01-20 14:32:15",
    description: "Nuevo submission creado para el reto 'Ordenamiento de Arrays'",
  },
  {
    id: "SUB-001",
    event: "Inicio de ejecución",
    timestamp: "2025-01-20 14:32:16",
    description: "Comenzó la ejecución del código en Python 3",
  },
  {
    id: "SUB-001",
    event: "Fin de ejecución",
    timestamp: "2025-01-20 14:32:18",
    description: "Ejecución completada exitosamente en 245ms",
  },
  {
    id: "SUB-002",
    event: "Error",
    timestamp: "2025-01-20 14:28:42",
    description: "Runtime Error: IndexError en línea 23",
  },
  {
    id: "SUB-003",
    event: "Tiempo excedido",
    timestamp: "2025-01-20 14:15:33",
    description: "Time Limit Exceeded: Ejecución superó los 2000ms",
  },
  {
    id: "SUB-004",
    event: "En cola",
    timestamp: "2025-01-20 15:01:05",
    description: "Submission agregado a la cola de ejecución",
  },
  {
    id: "SUB-005",
    event: "Error",
    timestamp: "2025-01-20 13:48:27",
    description: "Compilation Error: SyntaxError en línea 15",
  },
]

// Mock data for timeline
const timelineData = [
  {
    step: 1,
    type: "API Call",
    timestamp: "2025-01-20 14:32:15.234",
    description: "POST /api/submissions - Recepción del código",
    details: "Language: Python 3, Size: 1.2KB",
  },
  {
    step: 2,
    type: "Validación",
    timestamp: "2025-01-20 14:32:15.456",
    description: "Validación de sintaxis completada",
    details: "No errors found",
  },
  {
    step: 3,
    type: "Cola de ejecución",
    timestamp: "2025-01-20 14:32:15.678",
    description: "Submission agregado a la cola",
    details: "Queue position: 3",
  },
  {
    step: 4,
    type: "Inicio ejecución",
    timestamp: "2025-01-20 14:32:16.012",
    description: "Comenzó la ejecución en sandbox",
    details: "Container ID: c7f9a23b",
  },
  {
    step: 5,
    type: "Test Cases",
    timestamp: "2025-01-20 14:32:17.345",
    description: "Ejecutando casos de prueba (10/10)",
    details: "All passed",
  },
  {
    step: 6,
    type: "Finalización",
    timestamp: "2025-01-20 14:32:18.123",
    description: "Ejecución completada exitosamente",
    details: "Time: 245ms, Memory: 32.4MB",
  },
]

const getEventColor = (event: string) => {
  if (event.includes("Error") || event.includes("excedido")) {
    return "bg-rose-500/10 text-rose-700 border-rose-500/20"
  }
  if (event.includes("Fin") || event.includes("completada")) {
    return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
  }
  if (event.includes("Inicio") || event.includes("Creación")) {
    return "bg-blue-500/10 text-blue-700 border-blue-500/20"
  }
  return "bg-amber-500/10 text-amber-700 border-amber-500/20"
}

export default function MetricsPage() {
  const [searchId, setSearchId] = useState("SUB-001")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Métricas</h1>
        <p className="text-muted-foreground mt-2">Monitorea actividad, rendimiento y trazabilidad del sistema</p>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
          <TabsTrigger value="metrics">Métricas Básicas</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="traceability">Trazabilidad</TabsTrigger>
        </TabsList>

        {/* Métricas Básicas */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Submissions Total</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,284</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-emerald-600">+12.5%</span> vs. mes anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Submissions Fallidos</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">342</div>
                <p className="text-xs text-muted-foreground mt-1">26.6% tasa de error</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">342ms</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-emerald-600">-15ms</span> vs. promedio anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Errores Activos</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8</div>
                <p className="text-xs text-muted-foreground mt-1">Últimas 24 horas</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos adicionales */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Estados</CardTitle>
                <CardDescription>Últimos 7 días</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm">Accepted</span>
                  </div>
                  <span className="font-semibold">942 (73%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-rose-600" />
                    <span className="text-sm">Wrong Answer</span>
                  </div>
                  <span className="font-semibold">185 (14%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span className="text-sm">Time Limit Exceeded</span>
                  </div>
                  <span className="font-semibold">89 (7%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Runtime Error</span>
                  </div>
                  <span className="font-semibold">68 (5%)</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lenguajes Más Usados</CardTitle>
                <CardDescription>Top 5 lenguajes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Python 3</span>
                  <span className="font-semibold">512 (40%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">JavaScript</span>
                  <span className="font-semibold">384 (30%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Java</span>
                  <span className="font-semibold">256 (20%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">C++</span>
                  <span className="font-semibold">96 (7.5%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Go</span>
                  <span className="font-semibold">36 (2.5%)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Logs */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Registro de Eventos del Sistema
              </CardTitle>
              <CardDescription>Eventos cronológicos relacionados con los envíos</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Submission</TableHead>
                    <TableHead>Evento</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Descripción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">{log.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getEventColor(log.event)}>
                          {log.event}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.timestamp}</TableCell>
                      <TableCell className="text-sm">{log.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trazabilidad */}
        <TabsContent value="traceability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Trazabilidad de Submission
              </CardTitle>
              <CardDescription>Visualiza el recorrido completo de un submission específico</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Ingresa el ID del submission (ej: SUB-001)"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>

              {searchId && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <h3 className="font-semibold">Submission: {searchId}</h3>
                      <p className="text-sm text-muted-foreground">
                        Estudiante: Juan Pérez • Reto: Ordenamiento de Arrays
                      </p>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20">Accepted</Badge>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Línea Temporal
                    </h4>

                    <div className="space-y-3">
                      {timelineData.map((item) => (
                        <div key={item.step} className="flex gap-4 pb-4 border-b last:border-0">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                              {item.step}
                            </div>
                            {item.step < timelineData.length && <div className="w-0.5 h-full bg-border mt-2" />}
                          </div>
                          <div className="flex-1 pb-2">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <Badge variant="outline" className="mb-2">
                                  {item.type}
                                </Badge>
                                <p className="font-medium">{item.description}</p>
                                <p className="text-sm text-muted-foreground mt-1">{item.details}</p>
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">{item.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
