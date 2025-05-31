'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, X, Send, Upload, Image, Video, CheckCircle } from 'lucide-react';

export default function ReportBugButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!name.trim()) {
        throw new Error('Please enter your name');
      }
      
      if (!email.trim()) {
        throw new Error('Please enter your email');
      }
      
      if (!message.trim()) {
        throw new Error('Please enter a message');
      }

      // Prepare form data for submission
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('message', message);

      // Add files to form data
      files.forEach((file, index) => {
        formData.append(`file-${index}`, file);
      });

      console.log('Submitting bug report:', { name, email, message, files });
      
      // First ensure the bug_reports table exists
      await fetch('/api/bug-report', { method: 'GET' });

      // Send the bug report to our API endpoint
      const response = await fetch('/api/bug-report', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit bug report');
      }

      const result = await response.json();
      console.log('Bug report submitted:', result);

      // Show success message
      setIsSuccess(true);

      // Reset form after 5 seconds
      setTimeout(() => {
        setName('');
        setEmail('');
        setMessage('');
        setFiles([]);
        setIsSuccess(false);
        setIsOpen(false);
      }, 5000);
    } catch (error: any) {
      console.error('Error submitting bug report:', error);
      setError(error.message || 'Failed to submit bug report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all"
        aria-label="Report a bug"
      >
        <Bug className="w-5 h-5" />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed bottom-20 right-4 sm:right-10 z-50 w-full max-w-md bg-card dark:bg-card/95 rounded-lg shadow-xl border border-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center">
                  <Bug className="w-5 h-5 text-red-500 mr-2" />
                  <h3 className="font-medium text-foreground">Report a Bug</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-muted rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isSuccess ? (
                <div className="p-6 flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-medium text-center">Bug Report Submitted!</h3>
                  <p className="text-sm text-muted-foreground text-center mt-1">
                    Thank you for your feedback. We'll contact you at <span className="font-medium">{email}</span> with updates.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                  {error && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Your email address"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">We'll use this email to contact you about the bug</p>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                      Bug Description
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
                      placeholder="Describe the bug you encountered..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Attachments (Optional)
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        multiple
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center px-3 py-2 border border-border rounded-md shadow-sm text-sm font-medium bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </button>
                      <div className="ml-3 text-xs text-muted-foreground">
                        {files.length > 0 ? `${files.length} file(s) selected` : 'No files selected'}
                      </div>
                    </div>

                    {files.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                            <div className="flex items-center overflow-hidden">
                              {file.type.startsWith('image/') ? (
                                <Image className="h-4 w-4 mr-2 text-blue-500" />
                              ) : file.type.startsWith('video/') ? (
                                <Video className="h-4 w-4 mr-2 text-purple-500" />
                              ) : (
                                <div className="h-4 w-4 mr-2 bg-gray-400 rounded-sm" />
                              )}
                              <span className="text-xs truncate max-w-[180px]">{file.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="p-1 hover:bg-muted rounded-full transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Report
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
