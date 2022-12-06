import axios from 'axios';

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
  const daysPassed = Math.floor(((new Date()).getTime()-STARTING_DATE.getTime())/(1000*3600*24));
  const daysSince = Math.floor(((new Date()).getTime()-queryDate.getTime())/(1000*3600*24));

  const options = {
    method: 'GET',
    url: 'https://wordle-answers-solutions.p.rapidapi.com/answers',
    headers: {
      'X-RapidAPI-Key': 'b7e30a9b3amsh7d671edcb412c75p12e41fjsnc5e4d3ab537f',
      'X-RapidAPI-Host': 'wordle-answers-solutions.p.rapidapi.com'
    }
  };

  axios.request(options).then((apiRes) => {
    if (daysSince < 0 || daysSince >= apiRes.data.data.length) {
      return res.status(404).json({
        error: "No word found for specified date!",
        date: { year, month, day },
        timestamp: Date.now()
      });
    }
    const { num, answer } = apiRes.data.data.find((a) => Math.floor((new Date(Number(a.day))).getTime()-STARTING_DATE.getTime())/(1000*3600*24) === daysPassed);
  
    return res.status(200).json({
      id: num,
      solution: answer.toLowerCase(),
      timestamp: Date.now(),
    });
  }).catch((error) => {
    return res.status(500).json({
      error: error,
      timestamp: Date.now()
    });
  });
}