/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        'urban-kickz-products.s3.eu-north-1.amazonaws.com'
      ]
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
}
  
  module.exports = nextConfig