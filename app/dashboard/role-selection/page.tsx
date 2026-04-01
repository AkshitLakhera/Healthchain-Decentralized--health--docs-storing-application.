"use client"
import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function RoleSelection() {
  const { publicKey, connected } = useWallet()
  const router = useRouter()

  const handleRoleSelect = (role: string) => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet first.")
      return
    }

    localStorage.setItem("userRole", role)

    if (role === "doctor") {
      router.push("/dashboard/doctor")
    } else {
      router.push("/dashboard/patient")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-black"
      >
        Select Your Role
      </motion.h1>

      <div className="flex gap-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleRoleSelect("doctor")}
          className="px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-black/80 transition-all"
        >
          👨‍⚕️ Doctor
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleRoleSelect("patient")}
          className="px-6 py-3 bg-gray-200 text-black rounded-full font-semibold hover:bg-gray-300 transition-all"
        >
          🧍‍♂️ Patient
        </motion.button>
      </div>
    </div>
  )
}
