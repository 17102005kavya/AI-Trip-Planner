import React from 'react';

export const SelectBudgetOptions = [
  {
    id: 1,
    title: 'Cheap',
    desc: 'Stay conscious of costs',
    icon: '💵',
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 2,
    title: 'Moderate',
    desc: 'Keep cost on the average side',
    icon: '💰',
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    id: 3,
    title: 'Luxury',
    desc: "Don't worry about cost",
    icon: '💎',
    color: 'bg-purple-100 text-purple-600'
  }
];

function Budget({ onSelectedOption }: any) {
  return (
    <div className='grid grid-cols-1 gap-4 mt-4'>

      {SelectBudgetOptions.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelectedOption(item.title+":"+item.desc)}
          className='
            border bg-white rounded-2xl 
            flex items-center gap-3 
            p-4 cursor-pointer
            hover:border-primary 
            hover:bg-primary/5 
            transition-all
          '
        >
          <div
            className={`
              text-2xl flex-shrink-0
              w-12 h-12 rounded-xl
              flex items-center justify-center
              ${item.color}
            `}
          >
            {item.icon}
          </div>

          <div className='min-w-0'>
            <h2 className='font-semibold text-base text-black truncate'>
              {item.title}
            </h2>

            <p className='text-sm text-gray-500 line-clamp-1'>
              {item.desc}
            </p>
          </div>
        </div>
      ))}

    </div>
  );
}

export default Budget;