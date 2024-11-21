'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { Upload, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

const AVAILABLE_SIZES = [
  'UK 3', 'UK 3.5', 'UK 4', 'UK 4.5', 'UK 5', 'UK 5.5', 
  'UK 6', 'UK 6.5', 'UK 7', 'UK 7.5', 'UK 8', 'UK 8.5',
  'UK 9', 'UK 9.5', 'UK 10', 'UK 10.5', 'UK 11', 'UK 11.5', 'UK 12'
];

const AVAILABLE_COLORS = [
  'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 
  'Purple', 'Orange', 'Grey', 'Brown', 'Pink', 'Navy'
];

const CATEGORIES = [
  'Men', 'Women', 'Kids'
];

const STYLES = [
  'Running', 'Basketball', 'Casual', 'Football', 'Tennis',
  'Training', 'Skateboarding', 'Lifestyle', 'Walking'
];

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      const form = e.currentTarget as HTMLFormElement;
      
      const productData = {
        name: (form.elements.namedItem('name') as HTMLInputElement).value,
        brand: (form.elements.namedItem('brand') as HTMLInputElement).value,
        description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
        price: parseFloat((form.elements.namedItem('price') as HTMLInputElement).value),
        sizes: selectedSizes,
        colors: selectedColors,
        style: selectedStyle,         // Use selected style state
        category: selectedCategory,   // Use selected category state
        stock: {} // Initialize empty stock object
      };

      // Add product data to FormData
      formData.append('productData', JSON.stringify(productData));

      // Add images to FormData
      selectedImages.forEach((image, index) => {
        formData.append(`image${index}`, image);
      });

      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      toast.success('Product added successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-black"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
          <Image
            src="/logo7.png"
            alt="Urban Kickz Logo"
            width={120}
            height={80}
            className="h-12 w-auto"
          />
        </div>
      </div>

      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input name="name" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <Input name="brand" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              name="description" 
              className="w-full p-2 border rounded-md" 
              rows={4}
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <Input type="number" step="0.01" name="price" required />
          </div>
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Images</label>
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
                      required
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </div>
            
            {/* Image Preview */}
            {imagePreview.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {imagePreview.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-24 object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Sizes Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Sizes</label>
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_SIZES.map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant={selectedSizes.includes(size) ? "default" : "outline"}
                  className={`
                    h-10 text-sm
                    ${selectedSizes.includes(size) 
                      ? 'bg-[#B2D12E] text-black hover:bg-[#B2D12E]/80' 
                      : 'hover:bg-[#B2D12E]/10'
                    }
                  `}
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
            {selectedSizes.length === 0 && (
              <p className="text-red-500 text-xs mt-1">Please select at least one size</p>
            )}
          </div>
          
          {/* Colors Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Colors</label>
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_COLORS.map((color) => (
                <Button
                  key={color}
                  type="button"
                  variant={selectedColors.includes(color) ? "default" : "outline"}
                  className={`
                    h-10 text-sm flex items-center gap-2
                    ${selectedColors.includes(color) 
                      ? 'bg-[#B2D12E] text-black hover:bg-[#B2D12E]/80' 
                      : 'hover:bg-[#B2D12E]/10'
                    }
                  `}
                  onClick={() => toggleColor(color)}
                >
                  <span 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ 
                      backgroundColor: color.toLowerCase(),
                      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
                    }}
                  />
                  {color}
                </Button>
              ))}
            </div>
            {selectedColors.length === 0 && (
              <p className="text-red-500 text-xs mt-1">Please select at least one color</p>
            )}
          </div>
          
          {/* Categories Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  type="button"
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`
                    h-10 text-sm
                    ${selectedCategory === category 
                      ? 'bg-[#B2D12E] text-black hover:bg-[#B2D12E]/80' 
                      : 'hover:bg-[#B2D12E]/10'
                    }
                  `}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            {!selectedCategory && (
              <p className="text-red-500 text-xs mt-1">Please select a category</p>
            )}
          </div>

          {/* Styles Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Style</label>
            <div className="grid grid-cols-3 gap-2">
              {STYLES.map((style) => (
                <Button
                  key={style}
                  type="button"
                  variant={selectedStyle === style ? "default" : "outline"}
                  className={`
                    h-10 text-sm
                    ${selectedStyle === style 
                      ? 'bg-[#B2D12E] text-black hover:bg-[#B2D12E]/80' 
                      : 'hover:bg-[#B2D12E]/10'
                    }
                  `}
                  onClick={() => setSelectedStyle(style)}
                >
                  {style}
                </Button>
              ))}
            </div>
            {!selectedStyle && (
              <p className="text-red-500 text-xs mt-1">Please select a style</p>
            )}
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
              disabled={isLoading || 
                selectedSizes.length === 0 || 
                selectedColors.length === 0 ||
                !selectedCategory ||
                !selectedStyle
              }
            >
              {isLoading ? 'Adding...' : 'Add Product'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}