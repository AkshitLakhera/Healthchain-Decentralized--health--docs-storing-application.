"use client"

import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"

export default function PatientDashboard() {
  const { publicKey } = useWallet()
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!publicKey) return

    const wallet = publicKey.toString()
    console.log(wallet);

    fetch(`/api/report?wallet=${wallet}`)
      .then((res) => res.json())
      .then((data) => {
        setReports(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [publicKey])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold">Patient Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your health records securely
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="records" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          </TabsList>

          {/*  Medical Records */}
          <TabsContent value="records" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Medical Records</CardTitle>
                <CardDescription>
                  Encrypted reports stored on IPFS
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Loading */}
                {loading && (
                  <p className="text-muted-foreground">
                    Loading reports...
                  </p>
                )}

                {/* Empty */}
                {!loading && reports.length === 0 && (
                  <p className="text-muted-foreground">
                    No reports found
                  </p>
                )}

                {/*  Dynamic Reports */}
                {reports.map((record, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {record.fileName.replace(".enc", "")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {record.doctor}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </p>
                            <Button
              onClick={async () => {
                const res = await fetch("/api/share", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    cid: record.cid,
                    patientWallet: publicKey?.toString(),
                  }),
                })

                console.log("Status:", res.status)

                const text = await res.text()
                console.log("Raw response:", text)
                
                const data = JSON.parse(text)

                navigator.clipboard.writeText(
                  window.location.origin + data.url
                )

                alert("Share link copied (valid for 10 mins)")
              }}
            >
              Share
            </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-1"
                        onClick={async () => {
                          try {
                            const res = await fetch(
                              `https://gateway.pinata.cloud/ipfs/${record.cid}`
                            )

                            const encrypted = await res.text()

                            const { decryptData } = await import(
                              "@/lib/encryption"
                            )

                            const bytes = decryptData(encrypted)

                            const blob = new Blob([bytes], {
                              type: "application/pdf",
                            })

                            const url = URL.createObjectURL(blob)
                            window.open(url)
                          } catch (err) {
                            alert("Failed to open report")
                          }
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No appointments yet
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prescriptions */}
          <TabsContent value="prescriptions">
            <Card>
              <CardHeader>
                <CardTitle>Prescriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No prescriptions yet
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}