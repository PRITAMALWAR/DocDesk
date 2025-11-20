import React, { useState } from 'react'

export default function StarRating({ rating = 0, onRatingChange, readonly = false, size = 'md' }) {
  const [hoverRating, setHoverRating] = useState(0)
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }
  
  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value)
    }
  }
  
  const handleMouseEnter = (value) => {
    if (!readonly) {
      setHoverRating(value)
    }
  }
  
  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0)
    }
  }
  
  const displayRating = hoverRating || rating
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          disabled={readonly}
          className={`
            ${sizeClasses[size]}
            ${readonly ? 'cursor-default' : 'cursor-pointer transition-transform hover:scale-110'}
            ${star <= displayRating 
              ? 'text-yellow-400 fill-yellow-400' 
              : 'text-gray-300 fill-gray-300'
            }
          `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-full h-full"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

