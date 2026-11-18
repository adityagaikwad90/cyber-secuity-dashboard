import React, { useState } from 'react';
import { parseAndValidateFile, downloadSampleTemplate, REQUIRED_COLUMNS } from '../utils/excelValidator.js';

export default function UploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
  onResetDefault,
  isCustomData,
  totalRecords
}) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleFile = async (file) => {
    if (!file) return;
    setErrorMsg(null);
    setSuccessInfo(null);
    setLoading(true);

    try {
      const parsedRecords = await parseAndValidateFile(file);
      setSuccessInfo({
        fileName: file.name,
        rowCount: parsedRecords.length,
        records: parsedRecords,
      });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to process dataset file.');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleApply = () => {
    if (successInfo && successInfo.records) {
      onUploadSuccess(successInfo.records, successInfo.fileName);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container upload-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="upload-modal-title"
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow">LOCAL DATASET INGESTION</span>
            <h2 id="upload-modal-title">Upload Custom Cyber Risk Dataset</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close upload modal">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p className="upload-intro">
            Upload your own cybersecurity incident dataset in Excel (<b>.xlsx, .xls</b>), <b>CSV</b>, or <b>JSON</b> format.
            Parsing occurs 100% locally in your browser memory for total confidentiality.
          </p>

          {/* Current Dataset Status */}
          <div className="current-data-status">
            <span>Current Active Dataset:</span>
            <b>{isCustomData ? 'Custom Uploaded Data' : 'Reference Research Dataset (5,000 records)'}</b>
            {isCustomData && (
              <button
                type="button"
                className="reset-default-btn"
                onClick={() => {
                  onResetDefault();
                  onClose();
                }}
              >
                Reset to Default 5,000 Records
              </button>
            )}
          </div>

          {/* Dropzone */}
          <div
            className={`dropzone ${dragActive ? 'active' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
          >
            <div className="dropzone-icon">⇪</div>
            <div className="dropzone-text">
              <b>Drag & drop your Excel or CSV file here</b>
              <span>or click browse to choose from your computer</span>
            </div>
            <input
              type="file"
              accept=".xlsx,.xls,.csv,.json"
              className="file-input-hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
              id="file-upload-input"
            />
            <label htmlFor="file-upload-input" className="secondary-btn browse-btn">
              Browse File
            </label>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="upload-loading">
              <span className="spinner" /> Validating column schema and parsing records...
            </div>
          )}

          {/* Error Message Box */}
          {errorMsg && (
            <div className="upload-error-box">
              <div className="error-title">⚠ Dataset Validation Failed</div>
              <p className="error-desc">{errorMsg}</p>
              <div className="error-hint">
                Required columns: <code>{REQUIRED_COLUMNS.join(', ')}</code>
              </div>
            </div>
          )}

          {/* Success Message Box */}
          {successInfo && (
            <div className="upload-success-box">
              <div className="success-title">✓ Dataset Validated Successfully!</div>
              <p>
                File: <b>{successInfo.fileName}</b> — Parsed <b>{successInfo.rowCount.toLocaleString('en-IN')}</b> valid incident records.
              </p>
              <button type="button" className="primary-btn apply-btn" onClick={handleApply}>
                Apply to Dashboard Now
              </button>
            </div>
          )}

          {/* Template Download Help */}
          <div className="template-help-box">
            <div>
              <b>Need the exact column format?</b>
              <p>Download our pre-formatted sample Excel file matching the observatory schema.</p>
            </div>
            <button
              type="button"
              className="template-download-btn"
              onClick={downloadSampleTemplate}
            >
              ↓ Download Sample Excel
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
