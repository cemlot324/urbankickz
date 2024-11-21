import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import mongoose from 'mongoose'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})


export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await dbConnect()
    const formData = await request.formData()
    const productData = JSON.parse(formData.get('productData') as string)
    
    // Get existing images from the product data
    const existingImages = productData.existingImages || []
    delete productData.existingImages // Remove from the data we'll save
    
    // Handle new images if any
    const newImageUrls = []
    for (let i = 0; formData.has(`image${i}`); i++) {
      const image = formData.get(`image${i}`) as File
      const fileExtension = image.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExtension}`

      const uploadCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileName,
        Body: Buffer.from(await image.arrayBuffer()),
        ContentType: image.type,
      })

      await s3Client.send(uploadCommand)
      
      const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
      newImageUrls.push(imageUrl)
    }

    // Combine existing and new images
    const allImages = [...existingImages, ...newImageUrls]

    const updatedProduct = await Product.findByIdAndUpdate(
      context.params.id,
      {
        ...productData,
        images: allImages,
        updatedAt: new Date()
      },
      { new: true }
    )

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await dbConnect()
    await Product.findByIdAndDelete(context.params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    // Log the incoming ID for debugging
    console.log('Requested product ID:', context.params.id)

    // Validate MongoDB ObjectId
    if (!mongoose.isValidObjectId(context.params.id)) {
      console.log('Invalid ObjectId format')
      return NextResponse.json(
        { error: 'Invalid product ID format' },
        { status: 400 }
      )
    }

    // Create a proper MongoDB ObjectId
    const objectId = new mongoose.Types.ObjectId(context.params.id)
    const product = await Product.findById(objectId)

    console.log('Found product:', product)

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}