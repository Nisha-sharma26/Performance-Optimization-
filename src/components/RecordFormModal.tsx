import React, { useState, useCallback } from 'react'
import type { PerformanceRecord, CategoryType, ValidationErrors } from '../types/performance'
import { sanitizeInput } from '../utils/security'
import { X, AlertCircle, ShieldCheck } from 'lucide-react'

interface RecordFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (record: Omit<PerformanceRecord, 'id' | 'lastAudited'>) => void
}

const CATEGORIES: CategoryType[] = [
  'Breaking News',
  'Technology',
  'Opinion',
  'Politics',
  'Culture & Lifestyle',
  'Sports',
]

export const RecordFormModal: React.FC<RecordFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<CategoryType | ''>('')
  const [lcp, setLcp] = useState('')
  const [imageSizeKB, setImageSizeKB] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<ValidationErrors>({})

  const validate = useCallback((): boolean => {
    const newErrors: ValidationErrors = {}

    if (!title.trim()) {
      newErrors.title = 'Article title is required.'
    }

    if (!category) {
      newErrors.category = 'Please select a category.'
    }

    if (!lcp || isNaN(Number(lcp)) || Number(lcp) <= 0) {
      newErrors.lcp = 'Valid LCP score in milliseconds is required.'
    }

    if (!imageSizeKB || isNaN(Number(imageSizeKB)) || Number(imageSizeKB) < 0) {
      newErrors.imageSizeKB = 'Valid image payload size in KB is required.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [title, category, lcp, imageSizeKB])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    // Sanitize all text inputs against XSS before submitting to state
    const cleanTitle = sanitizeInput(title)
    const cleanNotes = sanitizeInput(notes)

    onSave({
      title: cleanTitle,
      category: category as CategoryType,
      lcp: Number(lcp),
      fid: Math.round(Number(lcp) * 0.02), // Estimated benchmark correlation
      cls: Number((Number(lcp) > 2500 ? 0.15 : 0.04).toFixed(2)),
      imageSizeKB: Number(imageSizeKB),
      status: Number(lcp) <= 2500 ? 'Optimized' : 'Needs Optimization',
      notes: cleanNotes,
    })

    // Reset form
    setTitle('')
    setCategory('')
    setLcp('')
    setImageSizeKB('')
    setNotes('')
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            Add New Performance Benchmark
          </h2>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="article-title" className="form-label">
              Article Title <span className="text-required">*</span>
            </label>
            <input
              id="article-title"
              type="text"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-label="Article Title"
              aria-invalid={errors.title ? 'true' : 'false'}
              aria-describedby={errors.title ? 'title-error' : undefined}
              placeholder="e.g. Breaking News: Election Updates"
            />
            {errors.title && (
              <span id="title-error" className="error-message" role="alert">
                <AlertCircle size={14} /> {errors.title}
              </span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="article-category" className="form-label">
                Category <span className="text-required">*</span>
              </label>
              <select
                id="article-category"
                className={`form-select ${errors.category ? 'input-error' : ''}`}
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                aria-label="Category"
                aria-invalid={errors.category ? 'true' : 'false'}
                aria-describedby={errors.category ? 'category-error' : undefined}
              >
                <option value="">Select Category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span id="category-error" className="error-message" role="alert">
                  <AlertCircle size={14} /> {errors.category}
                </span>
              )}
            </div>

            <div className="form-group flex-1">
              <label htmlFor="article-lcp" className="form-label">
                LCP Score (ms) <span className="text-required">*</span>
              </label>
              <input
                id="article-lcp"
                type="number"
                className={`form-input ${errors.lcp ? 'input-error' : ''}`}
                value={lcp}
                onChange={(e) => setLcp(e.target.value)}
                aria-label="LCP Score"
                aria-invalid={errors.lcp ? 'true' : 'false'}
                aria-describedby={errors.lcp ? 'lcp-error' : undefined}
                placeholder="e.g. 1450"
              />
              {errors.lcp && (
                <span id="lcp-error" className="error-message" role="alert">
                  <AlertCircle size={14} /> {errors.lcp}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="article-img-size" className="form-label">
              Image Size (KB) <span className="text-required">*</span>
            </label>
            <input
              id="article-img-size"
              type="number"
              className={`form-input ${errors.imageSizeKB ? 'input-error' : ''}`}
              value={imageSizeKB}
              onChange={(e) => setImageSizeKB(e.target.value)}
              aria-label="Image Size"
              aria-invalid={errors.imageSizeKB ? 'true' : 'false'}
              aria-describedby={errors.imageSizeKB ? 'img-size-error' : undefined}
              placeholder="e.g. 650"
            />
            {errors.imageSizeKB && (
              <span id="img-size-error" className="error-message" role="alert">
                <AlertCircle size={14} /> {errors.imageSizeKB}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="article-notes" className="form-label">
              Notes & Optimization Strategy
            </label>
            <textarea
              id="article-notes"
              className="form-textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              aria-label="Notes"
              placeholder="Detail optimization steps, e.g. CDN cache purge, image WebP conversion"
            />
          </div>

          <div className="security-notice">
            <ShieldCheck size={14} /> All inputs sanitized against XSS injection before saving.
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              aria-label="Save Record"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
