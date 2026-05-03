import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ErrorBoundary — React error boundary component.
 * Catches JavaScript errors anywhere in the child component tree,
 * logs them via Google Cloud Logging, and displays a fallback UI.
 * 
 * This prevents the entire app from crashing when a component fails.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Called when a descendant component throws an error.
   * Updates state so the next render shows the fallback UI.
   * @param {Error} error - The error that was thrown
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  /**
   * Called after a descendant component throws an error.
   * Logs the error for Google Cloud monitoring.
   * @param {Error} error - The thrown error
   * @param {React.ErrorInfo} errorInfo - Component stack information
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log to Google Cloud Logging via structured console output
    const logEntry = {
      severity: 'ERROR',
      message: `React ErrorBoundary caught: ${error.message}`,
      component: 'civicflow-frontend',
      errorName: error.name,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    };
    console.error(JSON.stringify(logEntry));
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="min-h-screen bg-[#FBFBFA] flex items-center justify-center px-6"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md text-center">
            <div className="text-6xl font-black font-display italic text-[#1A1A1A]/10 mb-8">
              Oops.
            </div>
            <h2 className="text-2xl font-black font-display uppercase tracking-tight text-[#1A1A1A] mb-4">
              Something went wrong
            </h2>
            <p className="text-[#1A1A1A]/60 font-sans mb-8">
              CivicFlow encountered an unexpected error. Please refresh the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#1A1A1A] text-white px-8 py-3 font-bold uppercase tracking-widest text-sm hover:bg-[#333] transition-colors"
              aria-label="Reload the page to recover from the error"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
