import axios from 'axios';

interface Query {
  year: number;
  month: number;
  day: number;
}

export default function handler(req, res) {
  if (req.method !== 'GET') return;

  const { year, month, day }: Query = req.query;

  const queryDate = new Date(`${month}/${day}/${year}`);
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
    console.log(apiRes.data.data[daysSince]);
    if (daysSince < 0 || daysSince >= apiRes.data.data.length) {
      return res.status(404).json({
        error: "No word found for specified date!",
        date: { year, month, day },
        timestamp: Date.now()
      });
    }
    const { num, answer } = apiRes.data.data[daysSince];
  
    return res.status(200).json({
      id: num,
      solution: answer.toLowerCase(),
      timestamp: Date.now()
    });
  }).catch((error) => {
    return res.status(500).json({
      error: error,
      timestamp: Date.now()
    });
  });

  // if (daysPassed < 0 || daysPassed > ANSWERS.length)
  //   return res.status(404).json({
  //     error: "No word found for specified date!",
  //     date: { year, month, day },
  //     timestamp: Date.now()
  //   });
  
  // const solution = ANSWERS[daysPassed];

  // res.status(200).json({
  //   id: daysPassed,
  //   date: { year, month, day },
  //   solution,
  //   timestamp: Date.now()
  // });
}