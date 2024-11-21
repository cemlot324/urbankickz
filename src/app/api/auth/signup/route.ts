import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(request: Request) {
  try {
    const { name, email, password, phoneNumber } = await request.json()
    console.log('Signup - Raw password length:', password.length)
    
    await dbConnect()

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Create user with raw password
    const user = await User.create({
      name,
      email,
      password,  // Raw password
      phoneNumber
    })

    console.log('User created with password length:', user.password.length)

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