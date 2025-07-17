'use client';

import React, { useState } from 'react';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function ResumeReader() {

  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('api/auth/signin')
  }

  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const uploadAndRead = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('resume', file);

    const res = await fetch('/api/resumereader', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setParsedData(data);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto border rounded-xl">
      <h2 className="text-xl font-bold mb-4">Resume Reader</h2>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-dashed border-2 p-6 mb-4 text-center rounded-lg cursor-pointer"
      >
        {file ? (
          <p>{file.name}</p>
        ) : (
          <p>Drag & drop your resume here or click to upload</p>
        )}
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFile}
          className="hidden"
          id="resumeUpload"
        />
        <label htmlFor="resumeUpload" className="block mt-2 text-blue-500 underline cursor-pointer">
          Choose file
        </label>
      </div>

      <button
        onClick={uploadAndRead}
        disabled={loading || !file}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Upload & Read'}
      </button>

      {parsedData && (
        <div className="mt-6 p-4 bg-gray-100 rounded text-black">
          <h3 className="font-semibold mb-2">Extracted Info:</h3>
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(parsedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
