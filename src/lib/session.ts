import type { User } from "firebase/auth";
import { useOutletContext } from "react-router-dom";
import type { HouseholdDoc, UserDoc } from "@/types/schema";

/** Shape of the React Router outlet context shared by every authenticated screen. */
export interface Session {
  user: User;
  userDoc: UserDoc;
  household: HouseholdDoc;
}

export function useSession(): Session {
  return useOutletContext<Session>();
}
