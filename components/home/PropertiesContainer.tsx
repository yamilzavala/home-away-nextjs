import { fetchProperties } from '@/utils/actions';
import PropertiesList from './PropertiesList';
import EmptyList from './EmptyList';
import type { PropertyCardProps } from '@/utils/types';

type PropertiesContainerProps = {
  category?: string;
  search?: string;
}

const PropertiesContainer = async ({category, search}: PropertiesContainerProps) => {
  const properties = await fetchProperties({search, category})

  if(properties.length < 1) {
    return (
        <EmptyList 
            heading='No results.'
            message='Try changing or removing some of your filters.'
            btnText='Clear Filters'
        />
    )
  }
  return <PropertiesList properties={properties} />
}

export default PropertiesContainer