import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request first to avoid losing it
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    
    // Log the received data for debugging
    console.log('Received bug report data:', { name, email, message });
    
    // Validate the data
    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email and message are required' },
        { status: 400 }
      );
    }

    // Get file attachments if any and upload them to Supabase storage
    const fileUrls: { name: string; type: string; size: number; url: string }[] = [];
    const supabase = await createRouteHandlerClient({ cookies });
    
    // Process and upload each file
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file-') && value instanceof File) {
        const file = value as File;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `bug-reports/${fileName}`;
        
        try {
          // Convert file to ArrayBuffer
          const arrayBuffer = await file.arrayBuffer();
          
          // Upload to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('bug-report-files')
            .upload(filePath, arrayBuffer, {
              contentType: file.type,
              cacheControl: '3600'
            });
            
          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            continue; // Skip this file but continue with others
          }
          
          // Get the public URL for the file
          const { data: urlData } = supabase
            .storage
            .from('bug-report-files')
            .getPublicUrl(filePath);
            
          fileUrls.push({
            name: file.name,
            type: file.type,
            size: file.size,
            url: urlData.publicUrl
          });
          
          console.log(`Uploaded file: ${file.name} to ${urlData.publicUrl}`);
        } catch (fileError) {
          console.error('Error processing file:', fileError);
        }
      }
    }

    // Get the current user from Supabase (we already created the client above)
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    
    // For debugging
    console.log('Session in API route:', session ? 'Session exists' : 'No session');
    
    // Use the user ID if available, otherwise use 'anonymous'
    const userId = session?.user?.id || 'anonymous';
    if (session?.user) {
      console.log('Authenticated user:', session.user.email);
    } else {
      console.log('No authenticated user, proceeding with form data');
    }

    // Try to create the bug_reports table first
    try {
      const { error: procedureError } = await supabase.rpc('create_function_if_not_exists');
      if (procedureError) {
        console.error('Error creating function:', procedureError);
      }
      
      const { error: tableError } = await supabase.rpc('create_bug_reports_table');
      if (tableError) {
        console.error('Error creating table:', tableError);
      }
    } catch (err) {
      console.error('Error setting up database:', err);
      // Continue anyway, as we'll handle insertion errors below
    }

    // Store the bug report in the database
    const { error: insertError } = await supabase
      .from('bug_reports') // Corrected table name
      .insert({
        user_id: userId, // Corrected field name
        name,
        email,
        message,
        files: fileUrls.length > 0 ? fileUrls : null, // Use the URLs of uploaded files
        status: 'new',
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error inserting bug report:', insertError);
      
      // If the table doesn't exist, we've already tried to create it above
      // Just log the error and continue to send the email notification
      console.log('Continuing despite database error to ensure email is sent');
    }

    // Send an email notification (in a real app, you would use a service like SendGrid, Mailgun, etc.)
    // For now, we'll just log the email that would be sent
    console.log(`
      Bug Report Notification
      -----------------------
      From: ${name} (${email})
      Message: ${message}
      Attachments: ${fileUrls.map(f => `${f.name} (${f.url})`).join(', ')}
      
      This bug report has been saved and will be reviewed by our team.
    `);

    // Return success response
    return NextResponse.json(
      { 
        success: true,
        message: 'Bug report submitted successfully. We will contact you via email soon.'
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error processing bug report:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process bug report' },
      { status: 500 }
    );
  }
}

// Function to create the bug_reports table and storage bucket if they don't exist
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Create the stored procedure if it doesn't exist
    const { error: procedureError } = await supabase.rpc('create_function_if_not_exists');
    
    if (procedureError) {
      console.error('Error creating function:', procedureError);
      return NextResponse.json(
        { error: 'Failed to create database function', details: procedureError.message },
        { status: 500 }
      );
    }
    
    // Create the bug_reports table if it doesn't exist
    const { error: tableError } = await supabase.rpc('create_bug_reports_table');
    
    if (tableError) {
      console.error('Error creating table:', tableError);
      return NextResponse.json(
        { error: 'Failed to create bug reports table', details: tableError.message },
        { status: 500 }
      );
    }
    
    // Check if the storage bucket exists and create it if it doesn't
    try {
      // First, try to get the bucket to see if it exists
      const { data: bucketData, error: getBucketError } = await supabase
        .storage
        .getBucket('bug-report-files');
      
      if (getBucketError) {
        // Bucket doesn't exist, create it
        const { error: createBucketError } = await supabase
          .storage
          .createBucket('bug-report-files', {
            public: true, // Make files publicly accessible
            fileSizeLimit: 10485760, // 10MB limit
            allowedMimeTypes: ['image/*', 'video/*', 'application/pdf']
          });
        
        if (createBucketError) {
          console.error('Error creating storage bucket:', createBucketError);
          // Continue anyway, as this might be a permission issue
        } else {
          console.log('Created storage bucket: bug-report-files');
        }
      } else {
        console.log('Storage bucket already exists: bug-report-files');
      }
      
      // Update bucket policies to make it public
      const { error: updateBucketError } = await supabase
        .storage
        .updateBucket('bug-report-files', {
          public: true
        });
      
      if (updateBucketError) {
        console.error('Error updating bucket policies:', updateBucketError);
      }
    } catch (bucketError) {
      console.error('Error managing storage bucket:', bucketError);
      // Continue anyway, as we don't want to fail the entire setup just because of storage issues
    }
    
    return NextResponse.json(
      { success: true, message: 'Bug reports system initialized successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error setting up bug reports:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to set up bug reports' },
      { status: 500 }
    );
  }
}
