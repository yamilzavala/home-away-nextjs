'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import FormContainer from './FormContainer';
import ImageInput from './ImageInput';
import { SubmitButton } from './Buttons';
import { type actionFunction } from '@/utils/types';
import { LuUser } from 'react-icons/lu';

type ImageInputContainerProps = {
    name: string,
    action: actionFunction,
    text: string,
    image: string,
    children?: React.ReactNode
}

const ImageInputContainer = (props: ImageInputContainerProps) => {
  const {image, name, text, action} = props;
  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);
  const userIcon = (
    <LuUser className='w-24 h-24 bg-primary rounded-md text-white mb-4' />
  );

  return (
    <div>
        {image ? (
            <Image
                src={image}
                height={100}
                width={100}
                alt={name}
                className='rounded-md object-cover mb-4 w-24 h-24'
            />
        ) : (
            userIcon
        )}

        <Button onClick={() => setUpdateFormVisible(s => !s)}>
            {text}
        </Button>
        {isUpdateFormVisible && (
            <div className='max-w-lg mt-4'>
                <FormContainer action={action}>
                    {props.children}
                    <ImageInput />
                    <SubmitButton  size='sm'/>
                </FormContainer>
            </div>
        )}
    </div>
  )
}

export default ImageInputContainer