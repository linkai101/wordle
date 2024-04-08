import React from 'react';
import { useRouter } from 'next/router';

const STARTING_DATE = new Date("6/19/2021");

export default function DateSelect({ wordleData, date }: { wordleData: any, date: { month: string, day: string, year: string } }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const currentEl = React.useRef<HTMLLIElement>(null);

  const dates = getDatesInRange(STARTING_DATE, new Date()).reverse();

  React.useEffect(() => {
    if (currentEl?.current) currentEl.current.scrollIntoView();
  }, [open]);

  return (
    <div className="w-fit relative">
      <button
        className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-12 py-1 md:py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        onClick={() => setOpen(open => !open)}
      >
        <span className="flex items-center">
          {dates.length>0 &&
            <span className="block truncate text-sm md:text-md">
              #{wordleData.id} - {(new Date(`${date.month}/${date.day}/${date.year}`)).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
            </span>
          }
        </span>
        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>

      <ul
        className={`absolute z-10 mt-1 w-full min-w-fit bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm
          ${open ? 'display-block' : 'hidden'}
        `}
        tabIndex={-1}
        role="listbox"
      >
        {dates.length-1-wordleData.id < 0 &&
        <li
          className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-2 text-sm md:text-md hover:bg-zinc-100"
          role="option"
          ref={currentEl}
        >
          <div className="flex items-center">
            <span className="block truncate">#{wordleData.id} - {(new Date(`${date.month}/${date.day}/${date.year}`)).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}</span>
          </div>

          <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-2">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        </li>
        }

        {dates.map((d,i) =>
          <li
            className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-2 text-sm md:text-md hover:bg-zinc-100"
            role="option"
            key={d.getTime()}
            onClick={() => {
              if (i===0) return router.push('/');
              router.push(`/${d.getFullYear()}/${("0"+(d.getMonth()+1)).slice(-2)}/${("0"+d.getDate()).slice(-2)}`);
            }}
            ref={i===dates.length-1-wordleData.id ? currentEl : null}
          >
            <div className="flex items-center">
              <span className="block truncate">#{dates.length-1-i} - {d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}</span>
            </div>

            {i===dates.length-1-wordleData.id &&
              <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-2">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            }
          </li>
        )}
      </ul>
    </div>
  );
}

function getDatesInRange(start, end) {
  const date = new Date(start.getTime());

  date.setDate(date.getDate());

  const dates = [];

  while (date <= end) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
}