import { Card, CardHeader } from '@/components/ui/card';

type StatsCardsProps = {
  title: string;
  value: number | string;
};

const StatsCard = ({title, value}: StatsCardsProps) => {
  return (
    <Card className='bg-muted'>
      <CardHeader className='flex flex-row justify-between items-center'>
        <h3 className='capitalize text-2xl font-bold'>{title}</h3>
        <span className='text-primary text-2xl font-extrabold'>{value}</span>
      </CardHeader>
    </Card>
  );
}

export default StatsCard