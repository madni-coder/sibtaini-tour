import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// GET: return all tours from database
export async function GET() {
    try {
        const supabase = getServiceSupabase();
        const { data: tours, error } = await supabase
            .from('tours')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) throw error;

        // Convert price strings to numbers
        const serializedTours = tours.map(tour => ({
            ...tour,
            price: parseFloat(tour.price)
        }));

        return NextResponse.json(serializedTours);
    } catch (error) {
        console.error('Error fetching tours:', error);
        return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 });
    }
}

// POST: accept form data, upload image to cardPics bucket, and create tour
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
        const imageFile = formData.get('image'); // Get image file from form data

        const supabase = getServiceSupabase();

        let imageUrl = '';

        // Upload image to cardPics bucket if provided
        if (imageFile && imageFile instanceof File) {
            const buffer = await imageFile.arrayBuffer();
            const safeName = imageFile.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\.-]/g, '');
            const fileName = `tours/${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${safeName}`;

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('cardPics')
                .upload(fileName, buffer, {
                    contentType: imageFile.type,
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('Image upload error:', uploadError);
                throw new Error('Failed to upload image');
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('cardPics')
                .getPublicUrl(fileName);

            imageUrl = publicUrl;
        }

        // Save tour to database using Supabase
        const { data: tour, error } = await supabase
            .from('tours')
            .insert({
                name,
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString(),
                price: parseFloat(price) || 0,
                from,
                to,
                description,
                images: imageUrl ? [imageUrl] : [],
            })
            .select()
            .single();

        if (error) throw error;

        // Convert price to number for JSON response
        const serializedTour = {
            ...tour,
            price: parseFloat(tour.price)
        };

        return NextResponse.json(serializedTour, { status: 201 });
    } catch (error) {
        console.error('Error creating tour:', error);
        return NextResponse.json({ error: error.message || 'Invalid request' }, { status: 400 });
    }
}

// PATCH: update an existing tour
export async function PATCH(request) {
    try {
        const formData = await request.formData();

        const id = formData.get('id')?.toString();
        if (!id) {
            return NextResponse.json({ error: 'Tour ID is required' }, { status: 400 });
        }

        const name = formData.get('name')?.toString() || '';
        const startDate = formData.get('startDate')?.toString() || '';
        const endDate = formData.get('endDate')?.toString() || '';
        const price = formData.get('price');
        const from = formData.get('from')?.toString() || formData.get('location')?.toString() || '';
        const to = formData.get('to')?.toString() || '';
        const description = formData.get('description')?.toString() || '';
        const imageFile = formData.get('image'); // Get new image file if provided

        const supabase = getServiceSupabase();

        // First, get the existing tour to access current images
        const { data: existingTour, error: fetchError } = await supabase
            .from('tours')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !existingTour) {
            return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
        }

        let imageUrl = existingTour.images && existingTour.images.length > 0 ? existingTour.images[0] : '';

        // Upload new image to cardPics bucket if provided
        if (imageFile && imageFile instanceof File) {
            const buffer = await imageFile.arrayBuffer();
            const safeName = imageFile.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\.-]/g, '');
            const fileName = `tours/${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${safeName}`;

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('cardPics')
                .upload(fileName, buffer, {
                    contentType: imageFile.type,
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('Image upload error:', uploadError);
                throw new Error('Failed to upload image');
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('cardPics')
                .getPublicUrl(fileName);

            imageUrl = publicUrl;

            // Optionally delete old image from storage if it exists
            if (existingTour.images && existingTour.images.length > 0) {
                const oldImageUrl = existingTour.images[0];
                const oldImagePath = oldImageUrl.split('/cardPics/')[1];
                if (oldImagePath) {
                    await supabase.storage.from('cardPics').remove([oldImagePath]);
                }
            }
        }

        // Update tour in database using Supabase
        const { data: tour, error } = await supabase
            .from('tours')
            .update({
                name,
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString(),
                price: parseFloat(price) || 0,
                from,
                to,
                description,
                images: imageUrl ? [imageUrl] : [],
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Convert price to number for JSON response
        const serializedTour = {
            ...tour,
            price: parseFloat(tour.price)
        };

        return NextResponse.json(serializedTour, { status: 200 });
    } catch (error) {
        console.error('Error updating tour:', error);
        return NextResponse.json({ error: error.message || 'Invalid request' }, { status: 400 });
    }
}

// DELETE: delete a tour and its associated image
export async function DELETE(request) {
    try {
        const body = await request.json();
        const id = body.id;

        if (!id) {
            return NextResponse.json({ error: 'Tour ID is required' }, { status: 400 });
        }

        const supabase = getServiceSupabase();

        // First, get the existing tour to access images for deletion
        const { data: existingTour, error: fetchError } = await supabase
            .from('tours')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !existingTour) {
            return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
        }

        // Delete associated images from storage if they exist
        if (existingTour.images && existingTour.images.length > 0) {
            for (const imageUrl of existingTour.images) {
                const imagePath = imageUrl.split('/cardPics/')[1];
                if (imagePath) {
                    await supabase.storage.from('cardPics').remove([imagePath]);
                }
            }
        }

        // Delete tour from database
        const { error: deleteError } = await supabase
            .from('tours')
            .delete()
            .eq('id', id);

        if (deleteError) throw deleteError;

        return NextResponse.json({ message: 'Tour deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting tour:', error);
        return NextResponse.json({ error: error.message || 'Failed to delete tour' }, { status: 400 });
    }
}
