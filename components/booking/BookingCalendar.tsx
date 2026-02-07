'use client';
import { Calendar } from '@/components/ui/calendar';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { DateRange } from 'react-day-picker';
import { useProperty } from '@/utils/store';

import {
  generateDisabledDates,
  generateDateRange,
  defaultSelected,
  generateBlockedPeriods,
} from '@/utils/calendar';

const BookingCalendar = () => {
  const [range, setRange] = useState<DateRange | undefined>(defaultSelected)
  const {bookings} = useProperty(state => state)
  const {toast} = useToast()
  
  const currentDate = new Date();
  const blockedPeriods = generateBlockedPeriods({bookings, today: currentDate})
  const unavailableDates = generateDisabledDates(blockedPeriods)

  useEffect(() => {
    const selectedRange = generateDateRange(range); 
    const isDisabledDateIncluded = selectedRange.some(date => {
      if(unavailableDates[date]) {
        setRange(defaultSelected)
        toast({
          description: 'Some dates are booked. Please select again.'
        })
        return true;
      }
      return false;
    })

    useProperty.setState({range})
  }, [range])

  return (
    <Calendar 
      mode='range'
      selected={range}
      onSelect={setRange}
      defaultMonth={currentDate}
      disabled={blockedPeriods}
      className='mb-4'
    />
  )
}

export default BookingCalendar