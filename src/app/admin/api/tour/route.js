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
