import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dqmpdzucmvockxzkizbi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbXBkenVjbXZvY2t4emtpemJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1OTA1MDYsImV4cCI6MjA5ODE2NjUwNn0.rkt37nbLIFsy5y8c7fBBKXeX7vKhBVeDswKuwn7Lnow'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)