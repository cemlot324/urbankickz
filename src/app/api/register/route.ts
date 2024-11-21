import { NextResponse } from "next/server"
import User from "@/models/User"
import dbConnect from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { name, email, password, phoneNumber } = await request.json()
    console.log('Register API - password length:', password.length) // Should be 8 for test1234

    await dbConnect()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Create new user with raw password
    const user = await User.create({
      name,
      email,
      password,  // Pass raw password, let pre-save hook handle hashing
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