"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function SharedPage() {
  const params = useParams()
  const id = params?.id as string
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [cid, setCid] = useState("")

  useEffect(() => {
    fetch(`/api/share/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setCid(data.cid)
        }
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <button
      onClick={async () => {
        const res = await fetch(
          `https://gateway.pinata.cloud/ipfs/${cid}`
        )
        const encrypted = await res.text()

        const { decryptData } = await import("@/lib/encryption")
        const bytes = decryptData(encrypted)

        const blob = new Blob([bytes], { type: "application/pdf" })
        const url = URL.createObjectURL(blob)

        window.open(url)
      }}
    >
      View Shared Report
    </button>
  )
}