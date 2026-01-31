import { FaHeart } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

const FavoriteToggleButton = ({propertyId}:{propertyId: string}) => {
  return (
    <Button size='icon' variant='outline' className='cursor-pointer p-2'>
        <FaHeart />
    </Button>
  )
}

export default FavoriteToggleButton