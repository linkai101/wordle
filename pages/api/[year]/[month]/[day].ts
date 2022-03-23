import ANSWERS from '../../../../data/answers.json';

// First word: June 19, 2021
const STARTING_DATE = new Date("6/19/2021");

interface Query {
  year: number;
  month: number;
  day: number;
}

export default function handler(req, res) {
  if (req.method !== 'GET') return;

  const { year, month, day }: Query = req.query;

  const queryDate = new Date(`${month}/${day}/${year}`);
  const daysPassed = Math.floor((queryDate.getTime()-STARTING_DATE.getTime())/(1000*3600*24));

  if (daysPassed < 0 || daysPassed > ANSWERS.length)
    return res.status(404).json({
      error: "No word found for specified date!",
      timestamp: Date.now()
    });

  const solution = ANSWERS[daysPassed];

  res.status(200).json({
    id: daysPassed,
    date: { year, month, day },
    solution,
    timestamp: Date.now()
  });
}