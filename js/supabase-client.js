// Initialize Supabase Client
// Replace these with your actual Supabase URL and Anon Key
window.SUPABASE_URL = 'https://pxrjmdbdyiyrvfhuabfw.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4cmptZGJkeWl5cnZoZnVhYmZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzOTA0MTMsImV4cCI6MjA5Mzk2NjQxM30.SWN03qXV5gO7xVD9PyRC6yKITFg_w_HL3h3FJOOBpI8';

// Use a self-executing function to avoid global namespace pollution for local variables
(function() {
  if (window.SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE') {
    // Check if supabase client is already initialized
    if (!window.supabaseClient) {
      window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
      console.log('Supabase client initialized');
    }
  } else {
    console.warn('Supabase URL and Key not configured. Using mock client.');
    
    window.supabaseClient = {
      from: (view) => ({
        select: () => ({
          data: [],
          error: { message: 'Supabase not configured' }
        })
      })
    };
  }
})();
