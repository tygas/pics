import React from 'react'

interface LoadingIndicatorProps {
  totalSize: number
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ totalSize }) => (
  <div
    className="loading-indicator"
    style={{
      top: totalSize,
    }}
  >
    <div className="loading-spinner" />
    <p>Loading more photos...</p>
  </div>
)
