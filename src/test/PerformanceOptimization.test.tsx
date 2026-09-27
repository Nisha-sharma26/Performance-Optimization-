import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import App from '../App'

describe('Performance Optimization for News Blog - Acceptance Criteria & NFRs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  // --- 1. Happy Path User Stories ---
  test('renders the Performance Optimization header, metrics, and core interface', () => {
    render(<App />)
    
    // Primary title
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Performance Optimization/i)
    
    // Metrics overview panels
    expect(screen.getByText(/Avg LCP Score/i)).toBeInTheDocument()
    expect(screen.getByText(/CDN Hit Rate/i)).toBeInTheDocument()
    expect(screen.getByText(/Assets Optimized/i)).toBeInTheDocument()
    
    // Core records table exists
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  test('allows searching and filtering performance records', async () => {
    render(<App />)
    const searchInput = screen.getByPlaceholderText(/search articles/i)
    
    await userEvent.type(searchInput, 'Breaking')
    expect(screen.getByText(/Breaking News: Election Updates/i)).toBeInTheDocument()
    expect(screen.queryByText(/Opinion: Tech Trends 2026/i)).not.toBeInTheDocument()
  })

  test('allows submitting a valid performance record form', async () => {
    render(<App />)
    const openFormBtn = screen.getByRole('button', { name: /add new record|new benchmark/i })
    await userEvent.click(openFormBtn)

    const titleInput = screen.getByRole('textbox', { name: /article title/i })
    const categorySelect = screen.getByRole('combobox', { name: /^category/i })
    const lcpInput = screen.getByRole('spinbutton', { name: /lcp score/i })
    const imgSizeInput = screen.getByRole('spinbutton', { name: /image size/i })
    const submitBtn = screen.getByRole('button', { name: /save record|submit/i })

    await userEvent.type(titleInput, 'Tech Weekly: AI Breakthroughs')
    await userEvent.selectOptions(categorySelect, 'Technology')
    await userEvent.type(lcpInput, '1200')
    await userEvent.type(imgSizeInput, '500')

    await userEvent.click(submitBtn)

    expect(screen.getByText('Tech Weekly: AI Breakthroughs')).toBeInTheDocument()
  })

  // --- 2. Unhappy Path Edge Cases ---
  test('displays user-friendly empty state when search returns zero results', async () => {
    render(<App />)
    const searchInput = screen.getByPlaceholderText(/search articles/i)

    await userEvent.type(searchInput, 'NonExistentArticleKeyword999')
    
    // Should show friendly empty state, not blank screen
    expect(screen.getByText(/no performance records found/i)).toBeInTheDocument()
  })

  test('prevents submission and highlights fields in red on invalid inputs', async () => {
    render(<App />)
    const openFormBtn = screen.getByRole('button', { name: /add new record|new benchmark/i })
    await userEvent.click(openFormBtn)

    const submitBtn = screen.getByRole('button', { name: /save record|submit/i })
    await userEvent.click(submitBtn)

    // Check invalid state / styling
    const titleInput = screen.getByRole('textbox', { name: /article title/i })
    expect(titleInput).toHaveAttribute('aria-invalid', 'true')
    expect(titleInput.classList.contains('input-error')).toBe(true)
    expect(screen.getByText(/article title is required/i)).toBeInTheDocument()
  })

  test('handles slow 3G / bad connectivity with visual loading indicator', async () => {
    render(<App />)
    
    // Toggle connectivity mode to Slow 3G
    const networkSelect = screen.getByRole('combobox', { name: /network speed connectivity/i })
    await userEvent.selectOptions(networkSelect, 'slow3g')

    const runAuditBtn = screen.getAllByRole('button', { name: /run optimization/i })[0]
    await userEvent.click(runAuditBtn)

    // Visual loading indicator must be present during async operation
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
    expect(screen.getByText(/optimizing asset under slow 3g/i)).toBeInTheDocument()

    // Wait for async operation completion
    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument()
    }, { timeout: 3000 })
  })

  // --- 3. Non-Functional Requirements (NFRs) ---
  test('sanitizes text inputs against XSS injection before storing in state', async () => {
    render(<App />)
    const openFormBtn = screen.getByRole('button', { name: /add new record|new benchmark/i })
    await userEvent.click(openFormBtn)

    const titleInput = screen.getByRole('textbox', { name: /article title/i })
    const categorySelect = screen.getByRole('combobox', { name: /^category/i })
    const lcpInput = screen.getByRole('spinbutton', { name: /lcp score/i })
    const imgSizeInput = screen.getByRole('spinbutton', { name: /image size/i })
    const submitBtn = screen.getByRole('button', { name: /save record|submit/i })

    // Malicious script input
    const maliciousScript = `<script>alert('XSS')</script>Headline Title`
    await userEvent.type(titleInput, maliciousScript)
    await userEvent.selectOptions(categorySelect, 'Technology')
    await userEvent.type(lcpInput, '1500')
    await userEvent.type(imgSizeInput, '600')
    await userEvent.click(submitBtn)

    // Stored & displayed title must not contain raw un-sanitized script tags
    expect(screen.queryByText("<script>alert('XSS')</script>Headline Title")).not.toBeInTheDocument()
    expect(screen.getByText('Headline Title')).toBeInTheDocument()
  })

  test('emits telemetry console logs on primary user actions', async () => {
    render(<App />)
    const searchInput = screen.getByPlaceholderText(/search articles/i)

    await userEvent.type(searchInput, 'Tech')

    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/\[Analytics\] User interacted with Performance Optimization/i)
    )
  })

  test('adheres to accessibility standards with ARIA labels and keyboard focusability', () => {
    render(<App />)
    
    const searchInput = screen.getByPlaceholderText(/search articles/i)
    expect(searchInput).toHaveAttribute('aria-label')

    const openFormBtn = screen.getByRole('button', { name: /add new record|new benchmark/i })
    expect(openFormBtn).toHaveAttribute('aria-label')

    // Test table headers have proper scope
    const headers = screen.getAllByRole('columnheader')
    expect(headers.length).toBeGreaterThan(0)
  })
})
