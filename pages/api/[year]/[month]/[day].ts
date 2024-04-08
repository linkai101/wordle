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

    fetch(`https://www.nytimes.com/svc/wordle/v2/${year}-${month}-${day}.json`)
    .then(nytRes => {
      if (nytRes.status === 404) {
        res.status(404).json({
          status: 'ERROR',
          error: "Not found",
          timestamp: Date.now()
        });
        resolve();
      }
      return nytRes.json();
    })
    .then(data => {
      data.id = data.days_since_launch || 0;
      res.status(200).json(data);
      resolve();
    })
    .catch(err => {
      res.status(500).json({
        status: 'ERROR',
        error: err.message,
        timestamp: Date.now()
      });
      resolve();
    });
  });
}