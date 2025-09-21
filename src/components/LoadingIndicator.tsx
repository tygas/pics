import React from 'react'

interface LoadingIndicatorProps {
  totalSize: number
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ totalSize }) => (
  <div
    className="loading-indicator"
    style={{
      position: 'absolute',
      top: totalSize,
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '20px',
    }}
  >
    <div className="loading-spinner" />
    <p>Loading more photos...</p>
  </div>
)
