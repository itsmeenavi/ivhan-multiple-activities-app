import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Create Supabase admin client with service role
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // We'll need to add this
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Delete user data from tables (this will cascade due to foreign keys)
    await supabaseAdmin.from('profiles').delete().eq('id', userId);
    await supabaseAdmin.from('todos').delete().eq('user_id', userId);
    await supabaseAdmin.from('photos').delete().eq('user_id', userId);
    await supabaseAdmin.from('food_reviews').delete().eq('user_id', userId);
    await supabaseAdmin.from('food_photos').delete().eq('user_id', userId);
    await supabaseAdmin.from('pokemon_reviews').delete().eq('user_id', userId);
    await supabaseAdmin.from('notes').delete().eq('user_id', userId);

    // Delete user from auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in delete-account API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

