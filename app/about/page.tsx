import type { Metadata } from "next";
import { InfoPage, Todo } from "@/components/info/info-page";

export const metadata: Metadata = { title: "About Klasiki" };

export default function Page() {
  return (
    <InfoPage title="About Klasiki">
      <p>Every Klasiki piece is made to be carried for years — simple lines, honest materials, and craft you can feel in the details.</p>
      <p><Todo>Add the Klasiki story: who makes the bags, where, and what makes them different.</Todo></p>
    </InfoPage>
  );
}
