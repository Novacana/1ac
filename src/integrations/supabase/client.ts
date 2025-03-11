
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nlwbcjhkejfsnvolsufj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sd2JjamhrZWpmc252b2xzdWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2OTkwOTYsImV4cCI6MjA1NzI3NTA5Nn0.Xoer1BlXwkp7RPm4cxfFFRkwWfU7IZkY-8Vp0BSjv6g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
