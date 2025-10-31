import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = '/largo-lab-portal/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-xl shadow-strong p-8">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>

              {/* Error Title */}
              <h1 className="text-2xl font-bold text-neutral-900 text-center mb-4">
                Something went wrong
              </h1>

              {/* Error Message */}
              <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-danger-700 font-semibold mb-2">
                  Error Details:
                </p>
                <p className="text-sm text-danger-600 font-mono">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
              </div>

              {/* Error Stack (Development Only) */}
              {import.meta.env.DEV && this.state.errorInfo && (
                <details className="mb-6">
                  <summary className="cursor-pointer text-sm font-semibold text-neutral-700 mb-2">
                    Technical Details (Development Mode)
                  </summary>
                  <pre className="text-xs bg-neutral-100 p-4 rounded-lg overflow-x-auto text-neutral-700 max-h-64">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={this.handleReset}
                  className="btn btn-primary flex-1 justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Return to Home
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="btn bg-neutral-300 hover:bg-neutral-400 flex-1 justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reload Page
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <p className="text-sm text-neutral-600 text-center">
                  If this problem persists, please contact your system administrator or{' '}
                  <a href="mailto:support@example.com" className="text-primary-600 hover:underline">
                    technical support
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
