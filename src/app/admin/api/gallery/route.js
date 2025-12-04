
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

// DELETE: remove gallery item and its storage object
export async function DELETE(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const id = body?.id;

        if (!id) {
            return NextResponse.json({ error: 'Gallery item id is required' }, { status: 400 });
        }

        const supabase = getServiceSupabase();

        // Fetch the gallery item first
        const { data: item, error: fetchError } = await supabase
            .from('gallery')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error('Error fetching gallery item for delete:', fetchError);
            return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
        }

        const imageUrl = item?.imageUrl || '';

        // Attempt to derive storage path from the public URL
        let storagePath = null;
        if (imageUrl) {
            // Supabase public URL patterns include '/storage/v1/object/public/<bucket>/<path>'
            const regex = /(?:storage\/v1\/object\/public\/)?cardPics\/(.+)$/;
            const match = imageUrl.match(regex);
            if (match && match[1]) {
                storagePath = match[1];
            } else {
                const idx = imageUrl.indexOf('/cardPics/');
                if (idx !== -1) storagePath = imageUrl.slice(idx + '/cardPics/'.length);
            }
        }

        // Remove storage object if we could determine a path
        if (storagePath) {
            const { error: removeError } = await supabase.storage
                .from('cardPics')
                .remove([storagePath]);

            if (removeError) {
                // Log but continue to remove DB record to avoid orphaned API state
                console.error('Error removing storage object:', removeError);
            }
        }

        // Delete DB record
        const { data: deleted, error: delError } = await supabase
            .from('gallery')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (delError) {
            console.error('Error deleting gallery DB record:', delError);
            return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
        }

        return NextResponse.json(deleted);
    } catch (error) {
        console.error('Error deleting gallery item:', error);
        return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
    }
}

