import { fetchProfileImage } from '@/utils/actions';
import { LuUser } from 'react-icons/lu';

const UserIcon = async () => {
  const profileImage = await fetchProfileImage()
  if(profileImage) {
    return <img src={profileImage} className='w-6 h-6 object-cover rounded-full' />
  }

  return (
    <LuUser className='w-6 h-6 bg-primary rounded-full text-white' />
  )
}

export default UserIcon