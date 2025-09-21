import React from 'react'

interface LoadingStateProps {
  message?: string
  className?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading photos...',
  className = '',
}) => {
  return (
    <div className={`loading-container ${className}`}>
      <div className="loading-spinner" />
      <p className="loading-message">{message}</p>
    </div>
  )
}

interface ErrorStateProps {
  error: string
  onRetry?: () => void
  className?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, className = '' }) => {
  return (
    <div className={`error-container ${className}`}>
      <h3>Unable to load photos</h3>
      <p>{error}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Try Again
        </button>
      )}
    </div>
  )
}
