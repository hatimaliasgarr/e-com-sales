// Initialize Supabase Client
// Replace these with your actual Supabase URL and Anon Key
const SUPABASE_URL = 'https://pxrjmdbdyiyrvhfuabfw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4cmptZGJkeWl5cnZoZnVhYmZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzOTA0MTMsImV4cCI6MjA5Mzk2NjQxM30.SWN03qXV5gO7xVD9PyRC6yKITFg_w_HL3h3FJOOBpI8';

// We initialize the client if the URL is provided. 
// Otherwise, we create a mock to prevent errors before the user configures it.
let supabase;

if (SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE') {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('Supabase client initialized');
} else {
  console.warn('Supabase URL and Key not configured. Using mock client.');
  
  // Mock client for UI presentation before DB is connected
  supabase = {
    from: (view) => ({
      select: () => ({
        data: [],
        error: { message: 'Supabase not configured' }
      })
    })
  };
}
