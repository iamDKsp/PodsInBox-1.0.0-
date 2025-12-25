import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image from buffer (for multer memory storage)
export async function uploadImage(buffer, folder = 'products') {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `podsinbox/${folder}`,
                resource_type: 'image',
                transformation: [
                    { width: 800, height: 800, crop: 'limit' },
                    { quality: 'auto', fetch_format: 'auto' }
                ]
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        uploadStream.end(buffer);
    });
}

// Delete image by public_id
export async function deleteImage(publicId) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
}

// Extract public_id from Cloudinary URL
export function getPublicIdFromUrl(url) {
    if (!url || !url.includes('cloudinary.com')) {
        return null;
    }

    const parts = url.split('/');
    const uploadIndex = parts.findIndex(p => p === 'upload');
    if (uploadIndex === -1) return null;

    // Get everything after 'upload/v{version}/'
    const pathParts = parts.slice(uploadIndex + 2);
    const publicId = pathParts.join('/').replace(/\.[^/.]+$/, ''); // Remove file extension
    return publicId;
}

export default cloudinary;
