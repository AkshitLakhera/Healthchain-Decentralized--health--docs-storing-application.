"use client"
import { uploadToPinata } from "@/lib/pinata"
import type React from "react"
import { motion } from "framer-motion"
import { getIPFSClient } from "@/lib/ipfs"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { storeReportOnSolana } from "@/lib/solana"
import { useWallet } from "@solana/wallet-adapter-react"

export default function DoctorUploadReportPage() {
  const [files, setFiles] = useState<File[]>([])
  const [recordType, setRecordType] = useState("")
  const [patientName, setPatientName] = useState("")
  const [blockchainAddress, setBlockchainAddress] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedReports, setUploadedReports] = useState<
  Array<{
    name: string
    type: string
    patient: string
    date: string
    hash: string
    blockchainAddress: string
    txSignature?: string 
  }>
>([])
  const { publicKey, sendTransaction } = useWallet()
  const recordTypes = [
    "Lab Results",
    "X-Ray",
    "MRI Scan",
    "CT Scan",
    "Blood Test",
    "Diagnosis Report",
    "Treatment Plan",
    "Prescription",
    "Other",
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = async () => {
    if (!files.length || !recordType || !patientName || !blockchainAddress) {
      alert("Please fill all fields and select files")
      return
    }
  
    if (!publicKey) {
      alert("Please connect your Solana wallet first!")
      return
    }
  
    setIsUploading(true)
    setUploadProgress(0)
  
    try {
      const ipfsClient = await getIPFSClient()
      for (const [index, file] of files.entries()) {
        const buffer = await file.arrayBuffer()
        // const added = await ipfsClient.add(buffer)
        // const cid = added.path
        const patientAddress = blockchainAddress?.toString()
        const cid = await uploadToPinata(file,patientAddress);
  
        setUploadProgress(((index + 1) / files.length) * 100)
        //  Record on Solana 
        const signature = await storeReportOnSolana(
          { publicKey, sendTransaction },
          cid,
          recordType
        )
  
        console.log("📦 CID stored on Solana with tx:", signature)
  
        setUploadedReports((prev) => [
          ...prev,
          {
            name: file.name,
            type: recordType,
            patient: patientName,
            date: new Date().toLocaleDateString(),
            hash: cid,
            blockchainAddress,
            txSignature: signature,
          },
        ])
      }
  
      alert(" Reports uploaded to IPFS and recorded on Solana!")
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Error uploading files. Check console for details.")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }
  
  

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
        <h1 className="text-4xl font-bold">Upload Patient Report</h1>
        <p className="text-muted-foreground">Upload medical reports to patient blockchain records</p>
      </motion.div>

      {/* Upload Form */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Add New Report</CardTitle>
            <CardDescription>Upload medical reports securely to the blockchain</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Patient Name */}
            <div className="space-y-2">
              <Label htmlFor="patient-name">Patient Name</Label>
              <Input
                id="patient-name"
                placeholder="Enter patient name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>

            {/* Record Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="record-type">Report Type</Label>
              <Select value={recordType} onValueChange={setRecordType}>
                <SelectTrigger id="record-type">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {recordTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="blockchain-address">Blockchain Address (Solana)</Label>
              <Input
                id="blockchain-address"
                placeholder="Enter patient's Solana wallet address"
                value={blockchainAddress}
                onChange={(e) => setBlockchainAddress(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The report will be stored on the Solana blockchain at this address
              </p>
            </div>

            {/* File Upload Area */}
            <div className="space-y-2">
              <Label htmlFor="file-input">Select Files</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  id="file-input"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <label htmlFor="file-input" className="cursor-pointer block">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground">PDF, JPG, PNG, DOC up to 10MB</p>
                </label>
              </div>

              {/* Selected Files */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Selected files:</p>
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uploading to blockchain...</span>
                  <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!files.length || !recordType || !patientName || !blockchainAddress || isUploading}
              className="w-full"
              size="lg"
            >
              {isUploading ? "Uploading..." : "Upload Report to Blockchain"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
{/* Uploaded Reports Section */}
<div className="mt-10">
  <h2 className="text-xl font-semibold mb-3">📄 Uploaded Reports</h2>

  {uploadedReports.length === 0 ? (
    <p className="text-gray-500">No reports uploaded yet.</p>
  ) : (
    <div className="space-y-3">
      {uploadedReports.map((report, index) => (
        <div
          key={index}
          className="p-4 border rounded-lg bg-white shadow-sm flex flex-col space-y-2"
        >
          <div>
            <strong>📋 Name:</strong> {report.name}
          </div>
          <div>
            <strong>👤 Patient:</strong> {report.patient}
          </div>
          <div>
            <strong>📅 Date:</strong> {report.date}
          </div>
          <div>
            <strong>🧾 Type:</strong> {report.type}
          </div>
          <div>
            <strong>🪪 CID:</strong>{" "}
            <a
              href={`https://ipfs.io/ipfs/${report.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View on IPFS
            </a>
          </div>
          <div>
            <strong>🔗 Solana Tx:</strong>{" "}
            <a
              href={`https://explorer.solana.com/tx/${report.txSignature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View on Solana Explorer
            </a>
          </div>
        </div>
      ))}
    </div>
  )}
</div>


      {/* Info Alert */}
      <motion.div variants={itemVariants}>
        <Alert>
          <AlertDescription>
            Reports are encrypted and stored on the Solana blockchain at the specified patient address. The patient will
            have full control over their medical records.
          </AlertDescription>
        </Alert>
      </motion.div>
    </motion.div>
  )
}
