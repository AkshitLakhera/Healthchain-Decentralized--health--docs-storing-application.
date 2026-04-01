import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()

  const report = await prisma.report.create({
    data: {
      patientWallet: body.patientWallet,
      cid: body.cid,
      fileName: body.fileName,
      doctor: body.doctor,
    },
  })

  return NextResponse.json(report)
}
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const wallet = searchParams.get("wallet")
  
    const reports = await prisma.report.findMany({
      where: {
        patientWallet: wallet || "",
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  
    return NextResponse.json(reports)
  }