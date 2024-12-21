import { settingsService } from './settingsService';
import { WatermarkSettings } from '../types';
import { supabase } from '../supabase';

export const imageService = {
  async upload(file: File): Promise<string> {
    try {
      const settings = await settingsService.getAll();
      const imgbbKey = settings.imgbb_api_key;
      
      if (!imgbbKey) {
        throw new Error('ImgBB API key not configured');
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to upload image');
      }

      return data.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  async applyWatermark(
    imageUrl: string,
    watermarkSettings: WatermarkSettings,
    productId?: string
  ): Promise<string> {
    if (!watermarkSettings.enabled || !watermarkSettings.image) {
      return imageUrl;
    }

    try {
      // Create a canvas to combine the images
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      // Load the main image
      const mainImage = await loadImage(imageUrl);
      canvas.width = mainImage.width;
      canvas.height = mainImage.height;

      // Draw the main image
      ctx.drawImage(mainImage, 0, 0);

      // Load and draw the watermark
      const watermark = await loadImage(watermarkSettings.image);
      
      // Calculate watermark size based on the new size setting (percentage of main image width)
      const watermarkWidth = mainImage.width * (watermarkSettings.size || 0.2); // Default to 20% if not specified
      const watermarkHeight = (watermark.height / watermark.width) * watermarkWidth;

      // Calculate position based on setting
      const position = calculateWatermarkPosition(
        watermarkSettings.position,
        mainImage.width,
        mainImage.height,
        watermarkWidth,
        watermarkHeight
      );

      // Set watermark opacity
      ctx.globalAlpha = watermarkSettings.opacity;

      // Draw watermark
      ctx.drawImage(
        watermark,
        position.x,
        position.y,
        watermarkWidth,
        watermarkHeight
      );

      // Reset opacity
      ctx.globalAlpha = 1.0;

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else throw new Error('Failed to create image blob');
        }, 'image/png');
      });

      // Upload the processed image
      const formData = new FormData();
      formData.append('image', blob);

      const settings = await settingsService.getAll();
      const imgbbKey = settings.imgbb_api_key;

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to upload watermarked image');
      }

      // If productId is provided, update the product in Supabase
      if (productId) {
        const { error } = await supabase
          .from('products')
          .update({
            watermark_image: watermarkSettings.image,
            watermark_position: watermarkSettings.position,
            watermark_opacity: watermarkSettings.opacity,
            watermark_size: watermarkSettings.size,
            processed_image: data.data.url
          })
          .eq('id', productId);

        if (error) {
          console.error('Error updating product with watermark:', error);
          throw error;
        }
      }

      return data.data.url;
    } catch (error) {
      console.error('Error applying watermark:', error);
      throw error;
    }
  }
};

// Helper function to load an image
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

// Helper function to calculate watermark position
function calculateWatermarkPosition(
  position: WatermarkSettings['position'],
  mainWidth: number,
  mainHeight: number,
  watermarkWidth: number,
  watermarkHeight: number
): { x: number; y: number } {
  const padding = 20;

  switch (position) {
    case 'top-left':
      return { x: padding, y: padding };
    case 'top-right':
      return { x: mainWidth - watermarkWidth - padding, y: padding };
    case 'bottom-left':
      return { x: padding, y: mainHeight - watermarkHeight - padding };
    case 'bottom-right':
      return { x: mainWidth - watermarkWidth - padding, y: mainHeight - watermarkHeight - padding };
    case 'center':
      return {
        x: (mainWidth - watermarkWidth) / 2,
        y: (mainHeight - watermarkHeight) / 2
      };
    default:
      return { x: padding, y: padding };
  }
}
