import React from 'react'

type ReviewCardProps = {
  reviewInfo: {
    comment: string;
    rating: number;
    name: string;
    image: string;
  };
  children?: React.ReactNode;    
}

const ReviewCard = ({reviewInfo}: ReviewCardProps) => {
  return (
    <div>ReviewCard</div>
  )
}

export default ReviewCard