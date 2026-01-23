'use client';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';

type SubmitButtonProps = {
    className?: string;
    text?: string;
};

const SubmitButton = ({ className = '', text = 'submit' }: SubmitButtonProps) => {
    const status = useFormStatus()
    return (
        <Button
            disabled={status.pending}
            type='submit'
            className={`capitalize ${className}`}
            size='lg'
        >
            {status.pending ?
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

export default SubmitButton