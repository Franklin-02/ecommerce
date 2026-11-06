import type { Metadata } from "next";
import { ProfileForms } from "@/components/account/profile-forms";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return <ProfileForms />;
}
