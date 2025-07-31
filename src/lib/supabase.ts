// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://krirjygnsufvlipqhltt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyaXJqeWduc3VmdmxpcHFobHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MDg3NDcsImV4cCI6MjA2ODk4NDc0N30.SzxyEVZYu7BFy6T-fKKyPI6WJblEMQj0W5HVnHa-2Sw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test connection
export const testConnection = async () => {
  const { data, error } = await supabase.from('leads').select('count()', { count: 'exact' });
  if (error) console.error('Supabase connection failed:', error);
  else console.log('Supabase connected, lead count:', data);
  return { connected: !error, data };
};