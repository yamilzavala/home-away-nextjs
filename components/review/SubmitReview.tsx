'use client';
import { useState } from 'react';
import { SubmitButton } from '@/components/form/Buttons';
import FormContainer from '@/components/form/FormContainer';
import { Card } from '@/components/ui/card';
import RatingInput from '@/components/form/RatingInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import { Button } from '@/components/ui/button';
import { createReviewAction } from '@/utils/actions';

const SubmitReview = ({propertyId}:{propertyId: string}) => {
  const [isReviewFormVisible, setIsReviewFormVisible] = useState<boolean>(false)
  return (
    <div className='mt-8'>
        <Button onClick={() => setIsReviewFormVisible(s => !s)}>
            Leave a Review
        </Button>
        {isReviewFormVisible && (
            <Card className='mt-8 p-8'>
                <FormContainer
                action={createReviewAction}
                >
                    <input type="hidden" name='propertyId' />
                    <RatingInput name='rating' />
                    <TextAreaInput 
                        name='comment'
                        labelText='your thoughts on this property'
                        defaultValue='Amazing place!'
                    />
                    <SubmitButton text='submit' className='mt-4'/>
                </FormContainer>
            </Card>
        )}
    </div>
  )
}

export default SubmitReview