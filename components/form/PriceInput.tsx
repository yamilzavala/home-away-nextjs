import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Prisma } from '@prisma/client';

type FormInputNumberProps = {
    defaultValue?: number
}

const PriceInput = ({defaultValue}: FormInputNumberProps) => {
  const name = 'price'
  // const name = Prisma.PropertyScalarFieldEnum.price;
  
  return (
    <div className='mb-2'>
        <Label className='capitalize' htmlFor='price'>
            Price ($)
        </Label>
        <Input 
            type='number'
            name={name}
            id={name}
            min={0}
            defaultValue={defaultValue || 100}
            required
        />
    </div>
  )
}

export default PriceInput