'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { Upload, X } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: string[];
  style: string;
  category: string;
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const data = await response.json();
        setProduct(data);
        setExistingImages(data.images);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to fetch product');
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      const form = e.currentTarget;
      
      // Prepare product data
      const productData = {
        name: form.name.value,
        brand: form.brand.value,
        description: form.description.value,
        price: parseFloat(form.price.value),
        sizes: form.sizes.value.split(',').map(size => size.trim()),
        colors: form.colors.value.split(',').map(color => color.trim()),
        style: form.style.value,
        category: form.category.value,
        existingImages: existingImages, // Include existing images
      };

      // Add product data to FormData
      formData.append('productData', JSON.stringify(productData));

      // Add new images to FormData if any
      selectedImages.forEach((image, index) => {
        formData.append(`image${index}`, image);
      });

      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to update product');

      toast.success('Product updated successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input name="name" defaultValue={product.name} required />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <Input name="brand" defaultValue={product.brand} required />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              name="description" 
              className="w-full p-2 border rounded-md" 
              rows={4}
              defaultValue={product.description}
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <Input 
              type="number" 
              step="0.01" 
              name="price" 
              defaultValue={product.price}
              required 
            />
          </div>
          
          {/* Existing Images */}
          <div>
            <label className="block text-sm font-medium mb-1">Current Images</label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {existingImages.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 bg-white rounded-full shadow-md hover:bg-red-50"
                    onClick={() => removeExistingImage(index)}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          {/* New Images Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Add New Images</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-[#B2D12E] hover:text-black focus-within:outline-none">
                    <span>Upload images</span>
                    <Input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Sizes (comma-separated)</label>
            <Input 
              name="sizes" 
              defaultValue={product.sizes.join(', ')}
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Colors (comma-separated)</label>
            <Input 
              name="colors" 
              defaultValue={product.colors.join(', ')}
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Style</label>
            <Input 
              name="style" 
              defaultValue={product.style}
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select 
              name="category" 
              className="w-full p-2 border rounded-md" 
              defaultValue={product.category}
              required
            >
              <option value="">Select Category</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#B2D12E] hover:bg-black hover:text-[#B2D12E] text-black"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Product'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}