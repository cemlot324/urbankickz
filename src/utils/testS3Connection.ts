import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function testConnection() {
  try {
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    console.log("Successfully connected to AWS S3!");
    console.log("Available buckets:", response.Buckets?.map(b => b.Name));
    return true;
  } catch (error) {
    console.error("Failed to connect to AWS S3:", error);
    return false;
  }
}