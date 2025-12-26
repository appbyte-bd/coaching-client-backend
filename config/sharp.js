import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

// Process single image
const processImage = async (file) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${file.fieldname}-${uniqueSuffix}.webp`;
    const outputPath = path.join('./images', filename);

    // await sharp(file.buffer)
    // .resize(768, 100, { fit: 'cover', withoutEnlargement: true })
    // .webp({ quality: 85 })
    // .toFile(outputPath);

    await sharp(file.buffer, { sequentialRead: true })
        // .resize(300, 300, { fit: 'cover', fastShrinkOnLoad: true, kernel: 'cubic' })
        .webp({ quality: 75, effort: 2 })
        .toFile(outputPath);

    return filename;
};

// Main middleware
export const processProductImages = async (req, res, next) => {
    try {
        if (!req.files?.image) return next();

        req.body.image = await processImage(req.files.image[0]);

        // Clear buffers from RAM after processing
        req.files.image.forEach(file => {
            file.buffer = null;
        });

        next();
    } catch (error) {
        if (req.body.image) await cleanupImages(req.body.image);

        res.status(500).json({
            success: false,
            message: 'Image processing failed',
            error: error.message
        });
    }
};

// Cleanup utility
export const cleanupImages = async (filenames) => {
    const files = Array.isArray(filenames) ? filenames : [filenames];

    await Promise.allSettled(
        files.map(filename =>
            fs.unlink(path.join('./images', filename))
        )
    );
};

// Delete single image
export const deleteImage = async (filename) => {
    try {
        await fs.unlink(path.join('./images', filename));
        return true;
    } catch (error) {
        console.error(`Delete failed: ${filename}`, error.message);
        return false;
    }
};