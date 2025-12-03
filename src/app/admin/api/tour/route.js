import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Simple in-memory store for created tours (replace with DB in production)
let tours = [];

// GET: return all tours (useful for quick testing)
export async function GET() {
    return NextResponse.json(tours);
}

// POST: accept form data (including multiple images) and save images to public/cardPics
export async function POST(request) {
    try {
        const formData = await request.formData();

        const name = formData.get('name')?.toString() || '';
        const startDate = formData.get('startDate')?.toString() || '';
        const endDate = formData.get('endDate')?.toString() || '';
        const price = formData.get('price');
        const from = formData.get('from')?.toString() || formData.get('location')?.toString() || '';
        const to = formData.get('to')?.toString() || '';
        const description = formData.get('description')?.toString() || '';

        // Handle multiple images (form field name should be 'images')
        const images = typeof formData.getAll === 'function' ? formData.getAll('images') : [];
        const savedImages = [];

        const dirPath = path.join(process.cwd(), 'public', 'cardPics');
        await mkdir(dirPath, { recursive: true });

        for (const file of images) {
            if (!file || typeof file === 'string') continue;
            const buffer = Buffer.from(await file.arrayBuffer());
            const safeName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\.-]/g, '');
            const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${safeName}`;
            const filePath = path.join(dirPath, fileName);
            await writeFile(filePath, buffer);
            // Public path served from project root; files in `public/cardPics` are available at `/cardPics/...`
            savedImages.push(`/cardPics/${fileName}`);
        }

        const tour = {
            id: Date.now(),
            name,
            startDate,
            endDate,
            price,
            from,
            to,
            description,
            images: savedImages,
            createdAt: new Date().toISOString(),
        };

        tours.push(tour);

        return NextResponse.json(tour, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
