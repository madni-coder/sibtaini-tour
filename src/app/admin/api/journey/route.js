import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// GET: Return all journey items from database
export async function GET() {
    try {
        const supabase = getServiceSupabase();
        const { data: journeyItems, error } = await supabase
            .from('journey')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return NextResponse.json(journeyItems);
    } catch (error) {
        console.error('Error fetching journey items:', error);
        return NextResponse.json({ error: 'Failed to fetch journey items' }, { status: 500 });
    }
}

// POST: Add a new journey item with uploaded image or video to Supabase Storage
export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || typeof file === 'string') {
            return NextResponse.json({ error: 'File is required' }, { status: 400 });
        }

        // Validate file type (images and videos only)
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
        const allValidTypes = [...validImageTypes, ...validVideoTypes];

        if (!allValidTypes.includes(file.type)) {
            return NextResponse.json({
                error: 'Invalid file type. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM, OGG, MOV) are allowed'
            }, { status: 400 });
        }

        // Determine media type
        const mediaType = validImageTypes.includes(file.type) ? 'image' : 'video';

        const supabase = getServiceSupabase();
        const buffer = Buffer.from(await file.arrayBuffer());
        const safeName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\.-]/g, '');
        const fileName = `journey/${mediaType}s/${Date.now()}_${safeName}`;

        // Upload to Supabase Storage (journey bucket)
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('journey')
            .upload(fileName, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('Error uploading file:', uploadError);
            return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('journey')
            .getPublicUrl(fileName);

        // Save to database using Supabase
        const { data: newItem, error } = await supabase
            .from('journey')
            .insert({
                mediaUrl: publicUrl,
                mediaType: mediaType,
                fileName: safeName
            })
            .select()
            .single();

        if (error) {
            console.error('Database insert error:', error);
            return NextResponse.json({
                error: 'Failed to save to database',
                details: error.message
            }, { status: 500 });
        }

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error('Error creating journey item:', error);
        return NextResponse.json({
            error: 'Failed to create journey item',
            details: error.message || 'Unknown error'
        }, { status: 400 });
    }
}

// DELETE: remove journey item and its storage object
export async function DELETE(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const id = body?.id;

        if (!id) {
            return NextResponse.json({ error: 'Journey item id is required' }, { status: 400 });
        }

        const supabase = getServiceSupabase();

        // Fetch the journey item first
        const { data: item, error: fetchError } = await supabase
            .from('journey')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error('Error fetching journey item for delete:', fetchError);
            return NextResponse.json({ error: 'Journey item not found' }, { status: 404 });
        }

        const mediaUrl = item?.mediaUrl || '';

        // Attempt to derive storage path from the public URL
        let storagePath = null;
        if (mediaUrl) {
            // Supabase public URL patterns include '/storage/v1/object/public/<bucket>/<path>'
            const regex = /(?:storage\/v1\/object\/public\/)?journey\/(.+)$/;
            const match = mediaUrl.match(regex);
            if (match && match[1]) {
                storagePath = match[1];
            } else {
                const idx = mediaUrl.indexOf('/journey/');
                if (idx !== -1) storagePath = mediaUrl.slice(idx + '/journey/'.length);
            }
        }

        // Remove storage object if we could determine a path
        if (storagePath) {
            const { error: removeError } = await supabase.storage
                .from('journey')
                .remove([storagePath]);

            if (removeError) {
                // Log but continue to remove DB record to avoid orphaned API state
                console.error('Error removing storage object:', removeError);
            }
        }

        // Delete DB record
        const { data: deleted, error: delError } = await supabase
            .from('journey')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (delError) {
            console.error('Error deleting journey DB record:', delError);
            return NextResponse.json({ error: 'Failed to delete journey item' }, { status: 500 });
        }

        return NextResponse.json(deleted);
    } catch (error) {
        console.error('Error deleting journey item:', error);
        return NextResponse.json({ error: 'Failed to delete journey item' }, { status: 500 });
    }
}
