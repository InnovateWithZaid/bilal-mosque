import { formatDistanceToNowStrict } from "date-fns";

import type { Mosque } from "@/types";

export function getPlaceTypeLabel(type: Mosque["type"]): string {
  switch (type) {
    case "mosque":
      return "Mosque";
    case "musallah":
      return "Musallah";
    case "eidgah":
      return "Eidgah";
    default:
      return "Location";
  }
}

export function getParkingLabel(parking: "available" | "limited" | "none"): string {
  switch (parking) {
    case "available":
      return "Parking available";
    case "limited":
      return "Limited parking";
    default:
      return "No parking";
  }
}

export function formatUpdatedAt(date: Date): string {
  return `Updated ${formatDistanceToNowStrict(date, { addSuffix: true })}`;
}

export function formatDistance(distance?: number): string {
  if (distance === undefined) {
    return "Distance unavailable";
  }

  if (distance < 1) {
    return `${Math.round(distance * 1000)} m away`;
  }

  return `${distance.toFixed(1)} km away`;
}
