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
