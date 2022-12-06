import axios from 'axios';

const STARTING_DATE = new Date("6/18/2021");

interface Query {
  year: number;
  month: number;
  day: number;
}

export default function handler(req, res) {
  return new Promise<void>((resolve, reject) => {
    if (req.method !== 'GET') {
      res.status(400).json({
        error: "Must be GET request",
        timestamp: Date.now()
      });
      resolve();
    }

    const { year, month, day }: Query = req.query;

    const queryDate = new Date(`${month}/${day}/${year}`);
    const daysSince = Math.floor(((new Date()).getTime()-queryDate.getTime())/(1000*3600*24));
    const daysPassed = Math.floor((queryDate.getTime()-STARTING_DATE.getTime())/(1000*3600*24));

    const options = {
      method: 'GET',
      url: 'https://wordle-answers-solutions.p.rapidapi.com/answers',
      headers: {
        'X-RapidAPI-Key': 'b7e30a9b3amsh7d671edcb412c75p12e41fjsnc5e4d3ab537f',
        'X-RapidAPI-Host': 'wordle-answers-solutions.p.rapidapi.com'
      }
    };

    axios.request(options).then((apiRes) => {
      if (daysSince < 0 || daysPassed < 0) {
        res.status(404).json({
          error: "No word found for specified date!",
          date: { year, month, day },
          timestamp: Date.now()
        });
        resolve();
      }
      const { answer } = apiRes.data.data.find(a => new Date(Number(a.day)).toDateString()===queryDate.toDateString());
      res.status(200).json({
        id: daysPassed,
        solution: answer.toLowerCase(),
        timestamp: Date.now(),
      });
      resolve();
    }).catch((error) => {
      res.status(500).json({
        error: error,
        timestamp: Date.now()
      });
      resolve();
    });
  });
}