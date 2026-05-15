import React from 'react';

export const SelectTravelesList = [
  {
    id: 1,
    title: 'Just Me',
    desc: 'A sole traveler in exploration',
    icon: '✈️',
    people: '1'
  },
  {
    id: 2,
    title: 'A Couple',
    desc: 'Two travelers in tandem',
    icon: '🥂',
    people: '2 People'
  },
  {
    id: 3,
    title: 'Family',
    desc: 'A group of fun loving adventures',
    icon: '🏡',
    people: '3 to 5 People'
  },
  {
    id: 4,
    title: 'Friends',
    desc: 'A bunch of thrill-seekers',
    icon: '⛺',
    people: '5 to 10 People'
  }
];

function GroupSize({onSelectedOption}:any) {
  return (
    <div className='grid grid-cols-2 gap-4 mt-4'>

      {SelectTravelesList.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelectedOption(item.title+":"+item.people)}
          className='
            border bg-white rounded-2xl 
            flex items-center gap-3 
            p-4 cursor-pointer
            hover:border-primary 
            hover:bg-primary/5 
            transition-all
          '
        >
          <div className='text-3xl flex-shrink-0'>
            {item.icon}
          </div>

          <div className='min-w-0'>
            <h2 className='font-semibold text-base text-black truncate'>
              {item.title}
            </h2>

            <p className='text-sm text-gray-500 line-clamp-1'>
              {item.people}
            </p>
          </div>
        </div>
      ))}

    </div>
  );
}

export default GroupSize;