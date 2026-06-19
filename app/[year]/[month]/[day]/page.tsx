import { notFound } from "next/navigation";
import { WordleUI } from "@/components/wordle";

export const revalidate = 86400;

interface ArchivePageProps {
  params: Promise<{ year: string; month: string; day: string }>;
}

export default async function ArchivePage({ params }: ArchivePageProps) {
  const { year, month, day } = await params;

  const res = await fetch(`https://www.nytimes.com/svc/wordle/v2/${year}-${month}-${day}.json`);
  if (!res.ok) {
    if (res.status === 404) notFound();
    throw new Error(`Failed to fetch Wordle data: ${res.status}`);
  }
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
