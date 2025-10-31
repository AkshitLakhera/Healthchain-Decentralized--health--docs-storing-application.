"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function DoctorDashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-4xl font-bold">Doctor Dashboard</h1>
        <p className="text-muted-foreground">Manage your patients and upload medical reports</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Patients", value: "24", icon: "👥" },
          { label: "Reports Uploaded", value: "18", icon: "📤" },
          { label: "Pending Reviews", value: "5", icon: "⏳" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{stat.value}</span>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Quick Action */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-black/5 to-black/0 border-black/10">
          <CardHeader>
            <CardTitle>Upload Patient Report</CardTitle>
            <CardDescription>Quickly upload a new medical report to patient blockchain records</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/doctor/upload-report">
              <Button className="bg-black text-white hover:bg-black/80">Go to Upload Page</Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="patients" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="patients">My Patients</TabsTrigger>
            <TabsTrigger value="reports">Recent Reports</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Patients</CardTitle>
                <CardDescription>Manage your patient list</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "John Doe", lastVisit: "2024-10-15", status: "Active" },
                  { name: "Jane Smith", lastVisit: "2024-10-10", status: "Active" },
                  { name: "Bob Johnson", lastVisit: "2024-09-28", status: "Inactive" },
                ].map((patient, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">Last visit: {patient.lastVisit}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-sm font-medium ${patient.status === "Active" ? "text-green-600" : "text-gray-600"}`}
                      >
                        {patient.status}
                      </span>
                      <Button variant="outline" size="sm" className="mt-1 block bg-transparent">
                        View Records
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Reports uploaded to the blockchain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { patient: "John Doe", type: "Lab Results", date: "2024-10-15", hash: "0x1a2b3c4d" },
                  { patient: "Jane Smith", type: "X-Ray Report", date: "2024-10-10", hash: "0x5e6f7g8h" },
                  { patient: "Bob Johnson", type: "Blood Test", date: "2024-09-28", hash: "0x9i0j1k2l" },
                ].map((report, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{report.patient}</p>
                      <p className="text-sm text-muted-foreground">{report.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono text-muted-foreground mb-2">{report.hash}</p>
                      <p className="text-sm text-muted-foreground">{report.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Consultations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No active consultations</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
