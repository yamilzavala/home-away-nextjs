import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type RatingInputProps = {
    name: string;
    labelText?: string;
}   

const RatingInput = ({name, labelText}: RatingInputProps) => {
  const numbers = Array.from({length: 5}, (_, i) => {
    const num = i + 1;
    return num.toString()
  }).reverse();
    
  return (
    <div className='mb-2 max-w-xs'>
        <Label htmlFor={name} className='capitalize'>
            {labelText || name}
        </Label>
        <Select defaultValue={numbers[0]} name={name} required>
            <SelectTrigger>
                <SelectValue/>
            </SelectTrigger>
            <SelectContent>
                {numbers.map(item => {
                    return (
                        <SelectItem key={item} value={item}>
                            {item}
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    </div>
  )
}

export default RatingInput