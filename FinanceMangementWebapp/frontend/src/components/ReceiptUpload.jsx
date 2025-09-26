import React, { useState } from 'react';
import axios from 'axios';

const ReceiptUpload = ({ onTransactionAdded }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const API_UPLOAD = 'http://localhost:5009/api/transactions/upload';

  const handleUpload = async () => {
    if (!file) return setMessage('Select a file first');

    const formData = new FormData();
    formData.append('receipt', file);

    try {
      const res = await axios.post(API_UPLOAD, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data.message);
      if (onTransactionAdded) onTransactionAdded(res.data.transaction);
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>Upload Receipt</h3>
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ReceiptUpload;