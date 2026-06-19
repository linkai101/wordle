import { WordleUI } from "@/components/wordle";

export const revalidate = 3600;

export default async function HomePage() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [year, month, day] = formatter.format(new Date()).split("-");

  const res = await fetch(`https://www.nytimes.com/svc/wordle/v2/${year}-${month}-${day}.json`);
  if (!res.ok) throw new Error(`Failed to fetch Wordle data: ${res.status}`);
  const wordleData = await res.json();

  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  date.setHours(23, 59, 59, 999);

  return (
    <WordleUI
      date={date}
      wordleNumber={wordleData.days_since_launch ?? 0}
      solution={wordleData.solution}
    />
  );
}
