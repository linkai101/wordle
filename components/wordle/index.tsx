import { CalendarDays, Info, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { DatePicker } from "./date-picker";
import { About } from "./about";
import { Game } from "./game";
import { Refresh } from "./refresh";

interface WordleUIProps {
  date: Date;
  wordleNumber: number;
  solution: string;
}

export function WordleUI({ date, wordleNumber, solution }: WordleUIProps) {
  return (
    <div className="flex flex-row-reverse">
      {/* RIGHT */}
      <div className="flex-1 overflow-hidden">
        <AboutSidebarContent />
      </div>

      {/* CENTER */}
      <section className="border-border container h-dvh max-w-2xl border-x">
        <Game solution={solution} header={<Header date={date} wordleNumber={wordleNumber} />} />
      </section>

      {/* LEFT */}
      <div className="flex flex-1 flex-col items-end overflow-hidden">
        <DatePickerSidebarContent selectedDate={date} />
      </div>
    </div>
  );
}

function Header({ date, wordleNumber }: { date: Date; wordleNumber: number }) {
  return (
    <div className="flex items-center p-4">
      <div className="flex flex-1 items-center gap-3 overflow-hidden xl:gap-4">
        <DatePickerDrawer selectedDate={date} />
      </div>

      <div>
        <h2 className="text-center text-xl leading-tight font-extrabold xl:text-2xl">
          {`Wordle #${wordleNumber}`}
        </h2>

        <p className="text-muted-foreground mt-1 text-center text-sm leading-tight">
          {date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3 overflow-hidden xl:gap-4">
        <Refresh />

        <AboutDrawer />
      </div>
    </div>
  );
}

function AboutSidebarContent() {
  return (
    <section className="hidden w-full max-w-sm p-4 xl:block">
      <About />
    </section>
  );
}

function DatePickerSidebarContent({ selectedDate }: { selectedDate: Date }) {
  return (
    <nav className="hidden w-full max-w-sm p-4 xl:block">
      <DatePicker selectedDate={selectedDate} />
    </nav>
  );
}

function AboutDrawer() {
  return (
    <div className="block max-w-2xl xl:hidden">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon-lg" className="size-9 xl:size-10">
            <Info className="size-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="border-border container max-w-2xl border-x border-t px-4 pb-8">
          <DrawerHeader className="sr-only">
            <DrawerTitle>About</DrawerTitle>
          </DrawerHeader>

          <div className="pt-6">
            <About />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function DatePickerDrawer({ selectedDate }: { selectedDate: Date }) {
  return (
    <div className="block xl:hidden">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon-lg" className="size-9 xl:size-10">
            <CalendarDays className="size-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="border-border container max-w-2xl border-x border-t pb-8">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Date Picker</DrawerTitle>
          </DrawerHeader>

          <div className="pt-6">
            <DatePicker selectedDate={selectedDate} modal />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
