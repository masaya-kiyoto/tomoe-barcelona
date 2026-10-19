"use client";

import { createContext, useContext, useState } from "react";
import { ReservationModal } from "./reservation-modal";

const ReservationContext = createContext<{ open: () => void } | null>(null);

export function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <ReservationContext.Provider value={{ open: () => setOpen(true) }}>
      {children}
      <ReservationModal open={isOpen} onOpenChange={setOpen} />
    </ReservationContext.Provider>
  );
}

export function useReservation() {
  const ctx = useContext(ReservationContext);
  if (!ctx) throw new Error("useReservation must be used inside <ReservationProvider>");
  return ctx;
}
