
import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// GET: Return all gallery items from database
export async function GET() {
    try {
        const supabase = getServiceSupabase();
        const { data: gallery, error } = await supabase
            .from('gallery')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return NextResponse.json(gallery);
    } catch (error) {
        console.error('Error fetching gallery:', error);
        return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
    }
}

// POST: Add a new gallery item with uploaded image to Supabase Storage
export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('image');

        if (!file || typeof file === 'string') {
            return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
        }

        const supabase = getServiceSupabase();
        const buffer = Buffer.from(await file.arrayBuffer());
        const safeName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\.-]/g, '');
        const fileName = `gallery/${Date.now()}_${safeName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('cardPics')
            .upload(fileName, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('cardPics')
            .getPublicUrl(fileName);

        // Save to database using Supabase
        const { data: newItem, error } = await supabase
            .from('gallery')
            .insert({ imageUrl: publicUrl })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error('Error creating gallery item:', error);
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

