import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kgazkjwoptioidkodmlo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnYXprandvcHRpb2lka29kbWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MTc2NDYsImV4cCI6MjA3MjM5MzY0Nn0.zZXNFpsphX0MtL8hAXy1zDmf_vAy4-pWkQncLpxThaU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)