import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type DestinationStatus = "wishlist" | "visited";

export type DestinationDatePrecision = "month" | "day";

export type Destination = {
  id: number;
  name: string;
  country?: string | null;
  note?: string | null;
  date?: string | null;
  date_precision: DestinationDatePrecision;
  status: DestinationStatus;
  created_at?: string | null;
};


export function useDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("fetchDestinations error:", error.message);
      return;
    }

    setDestinations(data || []);
  };

const addDestination = async (
  name: string,
  note?: string,
  date?: string | null,
  country?: string,
  status: DestinationStatus = "wishlist",
  datePrecision: DestinationDatePrecision = "day"
) => {
  if (!name.trim()) return;

  const { data, error } = await supabase
    .from("destinations")
    .insert([
      {
        name: name.trim(),
        country: country?.trim() || null,
        note: note?.trim() || null,
        date: date || null,
        status,
        date_precision: datePrecision,
      },
    ])
    .select();

  if (error) {
    console.error("addDestination error:", error.message);
    return;
  }

  if (data && data.length > 0) {
    setDestinations((prev) => [...prev, data[0]]);
  }
};

  const updateDestination = async (
  id: number,
  name: string,
  note?: string,
  date?: string | null,
  country?: string,
  status: DestinationStatus = "wishlist",
  datePrecision: DestinationDatePrecision = "day"
) => {
  if (!name.trim()) return;

  const trimmedName = name.trim();
  const trimmedNote = note?.trim() || null;
  const trimmedCountry = country?.trim() || null;

  const { error } = await supabase
    .from("destinations")
    .update({
      name: trimmedName,
      note: trimmedNote,
      date: date || null,
      country: trimmedCountry,
      status,
      date_precision: datePrecision,
    })
    .eq("id", id);

  if (error) {
    console.error("updateDestination error:", error.message);
    return;
  }

  setDestinations((prev) =>
    prev.map((item) =>
      item.id === id
        ? {
            ...item,
            name: trimmedName,
            note: trimmedNote,
            date: date || null,
            country: trimmedCountry,
            status,
            date_precision: datePrecision,
          }
        : item
    )
  );
};

  const deleteDestination = async (id: number) => {
    const old = destinations;

    setDestinations((prev) => prev.filter((item) => item.id !== id));

    const { error } = await supabase
      .from("destinations")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("deleteDestination error:", error.message);
      setDestinations(old);
    }
  };

  return {
    destinations,
    addDestination,
    updateDestination,
    deleteDestination,
  };
}