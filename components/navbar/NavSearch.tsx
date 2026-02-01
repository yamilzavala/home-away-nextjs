'use client'
import { Input } from '../ui/input';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from 'react';

const NavSearch = () => {
  // query params only
  const searchParams = useSearchParams();

  // programatic navigation
  const {replace} = useRouter() 

  const [search, setSearch] = useState(searchParams.get('search')?.toString() || '')

  const handleSearch = useDebouncedCallback((value: string) => {
    // clone params
    const params = new URLSearchParams(searchParams)
    if(value) {
      params.set('search',value)
    } else {
      params.delete('search')
    }
    replace(`/?${params.toString()}`)
  }, 300)

  useEffect(()=> {
    if(!searchParams.get('search')) {
      setSearch('')
    }
  }, [searchParams.get('search')])

  return (
    <Input 
      type='text' 
      placeholder='find a property...' 
      className='max-w-xs dark:bg-muted'
      value={search}
      onChange={e => {
        handleSearch(e.target.value)
        setSearch(e.target.value)
      }}
    />
  )
}

export default NavSearch