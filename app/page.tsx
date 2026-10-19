"use client";

import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Story } from "@/components/story";
import { Menu } from "@/components/menu";
import { Location } from "@/components/map";
import { ReserveBand } from "@/components/reserve-band";
import { Footer } from "@/components/footer";
import { ReservationProvider } from "@/components/reservation-context";

export default function Home() {
  return (
    <ReservationProvider>
      <Header />
      <main>
        <Hero />
        <Story />
        <Menu />
        <Location />
        <ReserveBand />
      </main>
      <Footer />
    </ReservationProvider>
  );
}
