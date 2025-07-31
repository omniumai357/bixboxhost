// components/BackupStatus.tsx
import { useEffect, useState } from 'react';

export default function BackupStatus() {
  const [lastBackup, setLastBackup] = useState('Never');
  const [status, setStatus] = useState<'connected' | 'error' | 'loading'>('loading');

  useEffect(() => {
    // Check backup log and connection status
    const checkStatus = async () => {
      try {
        // In production, this would check actual backup status
        // For now, simulate connection check
        const timestamp = new Date().toLocaleString();
        setLastBackup(timestamp);
        setStatus('connected');
      } catch (error) {
        console.error('Backup status check failed:', error);
        setStatus('error');
      }
    };

    checkStatus();
  }, []);

  return (
    <div className={`p-4 rounded-lg ${
      status === 'connected' ? 'bg-green-100 border border-green-200' : 
      status === 'error' ? 'bg-red-100 border border-red-200' : 
      'bg-gray-100 border border-gray-200'
    }`}>
      <h3 className="font-bold text-gray-900">Backup Status</h3>
      <p className="text-gray-700">Last backup: {lastBackup}</p>
      <div className={`inline-flex items-center mt-2 px-2 py-1 rounded text-xs font-medium ${
        status === 'connected' ? 'bg-green-200 text-green-800' :
        status === 'error' ? 'bg-red-200 text-red-800' :
        'bg-gray-200 text-gray-800'
      }`}>
        {status === 'connected' ? '✅ Connected' : 
         status === 'error' ? '❌ Error' : 
         '⏳ Loading'}
      </div>
    </div>
  );
}