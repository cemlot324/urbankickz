import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import User from "@/models/User"
import dbConnect from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { name, email, password, phoneNumber } = await request.json()

    await dbConnect()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber
    })

    return NextResponse.json(
      { message: "User created successfully", userId: user._id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: "Error creating user" },
      { status: 500 }
    )
  }
}