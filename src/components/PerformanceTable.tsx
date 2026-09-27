import React, { useState, useMemo, useCallback } from 'react'
import type { PerformanceRecord, NetworkSpeed } from '../types/performance'
import { Search, Plus, RotateCw, Filter, Inbox, ArrowUpDown } from 'lucide-react'

interface PerformanceTableProps {
  records: PerformanceRecord[]
  networkSpeed: NetworkSpeed
  onAddRecordClick: () => void
  onOptimizeAsset: (recordId: string) => Promise<void>
  onDeleteRecord: (recordId: string) => void
  onSearchChange: (query: string) => void
}

export const PerformanceTable: React.FC<PerformanceTableProps> = ({
  records,
  networkSpeed,
  onAddRecordClick,
  onOptimizeAsset,
  onDeleteRecord,
  onSearchChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [sortField, setSortField] = useState<'lcp' | 'title' | 'imageSizeKB'>('lcp')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  
  // Loading states per record id
  const [loadingRecordId, setLoadingRecordId] = useState<string | null>(null)

  const handleSearchInput = (val: string) => {
    setSearchQuery(val)
    onSearchChange(val)
  }

  const handleResetFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedStatus('all')
    onSearchChange('')
  }, [onSearchChange])

  // Wrap heavy filtering in useMemo
  const filteredRecords = useMemo(() => {
    return records
      .filter((rec) => {
        const matchesQuery =
          !searchQuery.trim() ||
          rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rec.category.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesCat =
          selectedCategory === 'all' || rec.category === selectedCategory

        const matchesStatus =
          selectedStatus === 'all' || rec.status === selectedStatus

        return matchesQuery && matchesCat && matchesStatus
      })
      .sort((a, b) => {
        const valA = a[sortField]
        const valB = b[sortField]
        if (typeof valA === 'string') {
          return sortOrder === 'asc'
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string)
        }
        return sortOrder === 'asc'
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number)
      })
  }, [records, searchQuery, selectedCategory, selectedStatus, sortField, sortOrder])

  const toggleSort = (field: 'lcp' | 'title' | 'imageSizeKB') => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const handleAuditClick = async (recordId: string) => {
    setLoadingRecordId(recordId)
    try {
      await onOptimizeAsset(recordId)
    } finally {
      setLoadingRecordId(null)
    }
  }

  return (
    <div className="table-container-card" role="region" aria-label="Performance Benchmark Records">
      <div className="table-controls-bar">
        <div className="search-box">
          <Search className="search-icon" size={16} aria-hidden="true" />
          <input
            type="text"
            className="search-input"
            placeholder="Search articles or categories..."
            aria-label="Search Articles"
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => handleSearchInput('')}
              aria-label="Clear Search"
            >
              ×
            </button>
          )}
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <Filter size={14} className="filter-icon" aria-hidden="true" />
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by Category"
            >
              <option value="all">All Categories</option>
              <option value="Breaking News">Breaking News</option>
              <option value="Technology">Technology</option>
              <option value="Opinion">Opinion</option>
              <option value="Politics">Politics</option>
              <option value="Culture & Lifestyle">Culture & Lifestyle</option>
              <option value="Sports">Sports</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              className="filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter by Optimization Status"
            >
              <option value="all">All Statuses</option>
              <option value="Optimized">Optimized</option>
              <option value="In Progress">In Progress</option>
              <option value="Needs Optimization">Needs Optimization</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onAddRecordClick}
            aria-label="Add New Record"
          >
            <Plus size={16} aria-hidden="true" />
            <span>New Benchmark</span>
          </button>
        </div>
      </div>

      {/* Global loading banner when an audit is running on slow 3G */}
      {loadingRecordId && (
        <div
          className="loading-banner"
          data-testid="loading-indicator"
          role="status"
          aria-live="polite"
        >
          <RotateCw className="spinner" size={18} />
          <span>
            Optimizing asset under {networkSpeed === 'slow3g' ? 'Slow 3G' : 'Current'} connection... Please wait.
          </span>
        </div>
      )}

      {/* Table Content */}
      <div className="table-responsive">
        <table className="performance-table" role="table" aria-label="Performance Optimization Benchmarks">
          <thead>
            <tr role="row">
              <th scope="col" role="columnheader">
                <button
                  type="button"
                  className="table-sort-btn"
                  onClick={() => toggleSort('title')}
                  aria-label="Sort by Title"
                >
                  Article Title <ArrowUpDown size={12} />
                </button>
              </th>
              <th scope="col" role="columnheader">Category</th>
              <th scope="col" role="columnheader">
                <button
                  type="button"
                  className="table-sort-btn"
                  onClick={() => toggleSort('lcp')}
                  aria-label="Sort by LCP Score"
                >
                  LCP (ms) <ArrowUpDown size={12} />
                </button>
              </th>
              <th scope="col" role="columnheader">
                <button
                  type="button"
                  className="table-sort-btn"
                  onClick={() => toggleSort('imageSizeKB')}
                  aria-label="Sort by Image Size"
                >
                  Image Size <ArrowUpDown size={12} />
                </button>
              </th>
              <th scope="col" role="columnheader">Status</th>
              <th scope="col" role="columnheader">Last Audited</th>
              <th scope="col" role="columnheader" className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => {
                const isLoadingThis = loadingRecordId === record.id
                return (
                  <tr key={record.id} role="row" tabIndex={0}>
                    <td role="cell" className="font-semibold text-main">
                      {record.title}
                      {record.notes && (
                        <div className="text-muted-notes">{record.notes}</div>
                      )}
                    </td>
                    <td role="cell">
                      <span className="badge-category">{record.category}</span>
                    </td>
                    <td role="cell">
                      <span
                        className={`lcp-tag ${
                          record.lcp <= 2500
                            ? 'lcp-good'
                            : record.lcp <= 4000
                            ? 'lcp-moderate'
                            : 'lcp-poor'
                        }`}
                      >
                        {record.lcp} ms
                      </span>
                    </td>
                    <td role="cell" className="font-mono">
                      {record.imageSizeKB} KB
                    </td>
                    <td role="cell">
                      <span
                        className={`status-badge status-${record.status
                          .toLowerCase()
                          .replace(/\s+/g, '-')}`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td role="cell" className="text-muted font-mono text-sm">
                      {record.lastAudited}
                    </td>
                    <td role="cell" className="text-right">
                      <div className="action-buttons-group">
                        <button
                          type="button"
                          className="btn-action"
                          onClick={() => handleAuditClick(record.id)}
                          disabled={isLoadingThis || networkSpeed === 'offline'}
                          aria-label={`Run Optimization for ${record.title}`}
                          title="Run Automated Optimization Audit"
                        >
                          <RotateCw
                            size={14}
                            className={isLoadingThis ? 'spinner' : ''}
                          />
                          <span>{isLoadingThis ? 'Auditing...' : 'Optimize'}</span>
                        </button>
                        <button
                          type="button"
                          className="btn-action-delete"
                          onClick={() => onDeleteRecord(record.id)}
                          aria-label={`Delete record ${record.title}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : null}
          </tbody>
        </table>

        {/* Empty State Component for Unhappy Path Requirement */}
        {filteredRecords.length === 0 && (
          <div className="empty-state-card" role="region" aria-label="Empty State Notice">
            <Inbox size={48} className="empty-icon" aria-hidden="true" />
            <h3 className="empty-title">No Performance Records Found</h3>
            <p className="empty-description">
              No performance records match your active search filter &quot;{searchQuery}&quot;. Try resetting your filters or creating a new record.
            </p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleResetFilters}
              aria-label="Reset All Filters"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
