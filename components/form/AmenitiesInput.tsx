'use client';
import { useState } from 'react';
import { amenities, Amenity } from '@/utils/amenities';
import { Checkbox } from '@/components/ui/checkbox';

type AmenitiesInputProps = {
    defaultValue?: Amenity[]
}

const AmenitiesInput = ({defaultValue}: AmenitiesInputProps) => {
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>(defaultValue || amenities)

  const handleChange = (amenitie: Amenity) => {
    setSelectedAmenities(prev => {
        return prev.map(a => {
            if(a.name === amenitie.name) {
                return {
                    ...a,
                    selected: !a.selected,
                }
            }
            return a
        })
    })
  }

  return (
    <section>
        <input type='hidden' name='amenities' value={JSON.stringify(selectedAmenities)} />
        <div className='grid md:grid-cols-2 gap-4'>
            {selectedAmenities.map(amenitie => (
                <div className='flex items-center space-x-2'>
                    <Checkbox 
                        id={amenitie.name}
                        checked={amenitie.selected}
                        onCheckedChange={() => handleChange(amenitie)}
                    />
                    <label
                        htmlFor={amenitie.name}
                        className='text-sm font-medium leading-none capitalize flex gap-x-2 items-center'
                    >
                        {amenitie.name}
                        <amenitie.icon className='w-4 h-4'/>
                    </label>
                </div>
            ))}
        </div>
    </section>
  )
}

export default AmenitiesInput