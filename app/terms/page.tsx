import type { Metadata } from "next";
import { InfoPage, Todo } from "@/components/info/info-page";

export const metadata: Metadata = { title: "Terms & conditions" };

export default function Page() {
  return (
    <InfoPage title="Terms & conditions">
      <p><Todo>Terms need to be written and reviewed by the Klasiki owner (ordering, pricing, cancellations, delivery, returns).</Todo></p>
    </InfoPage>
  );
}
