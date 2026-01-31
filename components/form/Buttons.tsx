'use client';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';

type btnSize = 'default' | 'lg' | 'sm';

type SubmitButtonProps = {
    className?: string;
    text?: string;
    size?: btnSize;
};

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

