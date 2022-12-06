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

  const daysPassed = Math.floor(((new Date()).getTime()-STARTING_DATE.getTime())/(1000*3600*24));

  const options = {
    method: 'GET',
    url: 'https://wordle-answers-solutions.p.rapidapi.com/today',
    headers: {
      'X-RapidAPI-Key': 'b7e30a9b3amsh7d671edcb412c75p12e41fjsnc5e4d3ab537f',
      'X-RapidAPI-Host': 'wordle-answers-solutions.p.rapidapi.com'
    }
  };

  axios.request(options).then((apiRes) => {
    const solution = apiRes.data.today.toLowerCase();
  
    return res.status(200).json({
      id: daysPassed,
      solution,
      timestamp: Date.now()
    });
  }).catch((error) => {
    return res.status(500).json({
      error: error,
      timestamp: Date.now()
    });
  });
}