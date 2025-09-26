import React from 'react';
import TransactionsPanel from './TransactionsPanel';
import UploadReceipt from './UploadReceipt';

export default function Dashboard(){
  return (
    <div className="grid">
      <div>
        <div className="card">
          <h3>Quick actions</h3>
          <p className="small">Add a transaction or upload a receipt</p>
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button className="btn" onClick={()=>document.getElementById('add-amount') && document.getElementById('add-amount').focus()}>Add Transaction</button>
            <button className="btn" onClick={()=>document.getElementById('upload-file') && document.getElementById('upload-file').click()}>Upload Receipt</button>
          </div>
        </div>

        <TransactionsPanel />
      </div>

      <div>
        <div className="card">
          <UploadReceipt />
        </div>
        <div className="card small">
          <h4>Notes</h4>
          <ul>
            <li>No JWTs — session cookies used (secure this before production)</li>
            <li>PDF receipts are uploaded to the backend for parsing</li>
            <li>Image receipts are processed in-browser using Tesseract.js</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
