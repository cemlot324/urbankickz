import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function GET() {
  try {
    await dbConnect()
    const products = await Product.find({})
    console.log('Sample product ID:', products[0]?._id)
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const formData = await request.formData()
    const productData = JSON.parse(formData.get('productData') as string)
    
    // Handle images upload to S3
    const imageUrls = []
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
      imageUrls.push(imageUrl)
    }

    const product = await Product.create({
      ...productData,
      images: imageUrls,
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}