import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function UploadReceipt(){
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleProcess(){
    if(!file) return alert('select file');
    setOutput('');
    setLoading(true);
    try {
      if(file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')){
        // upload to backend
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload/pdf', { method: 'POST', body: fd, credentials: 'include' });
        const data = await res.json();
        setOutput(JSON.stringify(data, null, 2));
      } else if(file.type.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png)$/i)){
        // client-side OCR
        const { data: { text } } = await Tesseract.recognize(file, 'eng', { logger: m => {/*progress*/} });
        const amounts = (text.match(/\d+[.,]?\d*/g) || []).map(s=>parseFloat(s.replace(/,/g,'')));
        const suggested = amounts.length ? Math.max(...amounts) : null;
        setOutput(JSON.stringify({ text, suggested_amount: suggested }, null, 2));
      } else {
        setOutput('Unsupported file type');
      }
    } catch (err) {
      setOutput('Processing failed: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h4>Upload Receipt</h4>
      <input id="upload-file" type="file" onChange={e=>setFile(e.target.files[0])} />
      <div style={{marginTop:8}}>
        <button className="btn" onClick={handleProcess} disabled={loading}>{loading ? 'Processing...' : 'Process'}</button>
      </div>
      <pre style={{whiteSpace:'pre-wrap',marginTop:12,background:'#f8fafc',padding:12,borderRadius:8}}>{output}</pre>
    </div>
  )
}
