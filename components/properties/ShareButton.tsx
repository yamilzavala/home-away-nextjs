'use client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '../ui/button';
import { LuShare2 } from 'react-icons/lu';

import {
  TwitterShareButton,
  EmailShareButton,
  LinkedinShareButton,
  TwitterIcon,
  EmailIcon,
  LinkedinIcon,
} from 'react-share';

type ShareButtonProps = {
  propertyId: string;
  name: string;    
}

const ShareButton = ({propertyId, name}: ShareButtonProps) => {
  const url = process.env.NEXT_PUBLIC_WEBSITE_URL;
  const shareLink = `${url}/properties/${propertyId}`;

  return (
    <Popover>
        <PopoverTrigger asChild>
            <Button
                size='icon'
                variant='outline'
                className='p-2'
            >
                <LuShare2 />
            </Button>
        </PopoverTrigger>

        <PopoverContent
            side='top'
            align='end'
            sideOffset={10}
            className='flex items-center gap-x-2 justify-center w-full'
        >
            <TwitterShareButton url={shareLink} title={name}>
                <TwitterIcon size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton url={shareLink} title={name}>
                <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <EmailShareButton url={shareLink} title={name}>
                <EmailIcon size={32} round />
            </EmailShareButton>
        </PopoverContent>
    </Popover>
  )
}

export default ShareButton