'use client';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { SignInButton } from '@clerk/nextjs';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { LuPen, LuTrash2 } from "react-icons/lu";

type btnSize = 'default' | 'lg' | 'sm';

type SubmitButtonProps = {
    className?: string;
    text?: string;
    size?: btnSize;
};

type actionType = 'delete' | 'edit';

export const IconButton = ({actionType}: {actionType: actionType}) => {
    const {pending} = useFormStatus()

    const renderIcon = () => {
        switch (actionType) {
            case 'edit':
              return <LuPen />   
            case 'delete':
              return <LuTrash2 />     
        
            default:
              const never: never = actionType;
              throw new Error(`Invalid action type: ${never}`);
        }
    }

    return (
        <Button 
          variant='link'
          size='icon'
          type='submit'
          className='p-2 cursor-pointer'
        >
            {pending ? <ReloadIcon className="animate-spin" /> : renderIcon()}
        </Button>
    )
}

export const SubmitButton = ({ className = '', text = 'submit', size = 'lg' }: SubmitButtonProps) => {
    const {pending} = useFormStatus()
    return (
        <Button
            disabled={pending}
            type='submit'
            className={`capitalize ${className}`}
            size='lg'
        >
            {pending ?
                (
                    <>
                        <ReloadIcon className="animate-spin h4-w-4 mr-2" />
                        Please wait...
                    </>
                ) : (
                    text
                )}
        </Button>
    )
}

export const CardSignInButton = () => {
    return (
        <SignInButton mode='modal'>
            <Button
                asChild
                type='button'
                size='icon'
                variant='outline'
                className='p-2 cursor-pointer'
            >
                <FaRegHeart />
            </Button>
        </SignInButton>
    )
}

export const CardSubmitButton = ({ isFavorite }: { isFavorite: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type='submit'
      size='icon'
      variant='outline'
      className=' p-2 cursor-pointer'
    >
      {pending ? (
        <ReloadIcon className=' animate-spin' />
      ) : isFavorite ? (
        <FaHeart />
      ) : (
        <FaRegHeart />
      )}
    </Button>
  );
};

