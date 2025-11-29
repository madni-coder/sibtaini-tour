
import { NextResponse } from 'next/server';
import { writeFile, mkdir, readdir, stat } from 'fs/promises';
import path from 'path';

// Dummy in-memory gallery store
let gallery = [];

// GET: Return all gallery items
export async function GET() {
    try {
        const dirPath = path.join(process.cwd(), 'public');
        // Ensure directory exists (no error if it already exists)
        await mkdir(dirPath, { recursive: true });
        const files = await readdir(dirPath);
        // Build items from files, include only files (not directories)
        const items = await Promise.all(files.map(async (name) => {
            const full = path.join(dirPath, name);
            try {
                const s = await stat(full);
                if (!s.isFile()) return null;
                return { id: s.mtimeMs || Date.now(), imageUrl: `/public/${name}` };
            } catch (e) {
                return null;
            }
        }));
        const filtered = items.filter(Boolean).sort((a, b) => b.id - a.id);
        return NextResponse.json(filtered);
    } catch (err) {
        return NextResponse.json([], { status: 200 });
    }
}

// POST: Add a new gallery item with uploaded image
export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('image');
        if (!file || typeof file === 'string') {
            return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}_${file.name}`;
        const dirPath = path.join(process.cwd(), 'public');
        // ensure directory exists
        await mkdir(dirPath, { recursive: true });
        const filePath = path.join(dirPath, fileName);
        await writeFile(filePath, buffer);
        const imageUrl = `/public/${fileName}`;
        const newItem = { id: Date.now(), imageUrl };
        gallery.push(newItem);
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

