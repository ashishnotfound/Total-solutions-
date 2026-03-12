import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing supabase keys in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixBucket() {
    console.log("Updating bucket 'site'...");
    const { error } = await supabase.storage.updateBucket('site', {
        allowedMimeTypes: ["image/*", "video/*", "application/pdf"], // Allow images, videos, pdfs
        public: true
    });

    if (error) {
        console.error("Error updating bucket:", error);
    } else {
        console.log("Bucket updated successfully");
    }
}

fixBucket();
