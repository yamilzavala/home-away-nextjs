'use client';

import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { actionFunction } from '@/utils/types';

type FormContainerProps = {
    action: actionFunction,
    children: React.ReactNode
}

const initialState = {
  message: '',
};

const FormContainer = ({children, action}: FormContainerProps) => {
  const [state, formAction] = useFormState(action, initialState)
  const {toast} = useToast()

  useEffect(() => {
    if(state.message) {
        toast({description: state.message})
    }
  }, [state])

  return (
    <form action={formAction}>
        {children}
    </form>
  )
}

export default FormContainer