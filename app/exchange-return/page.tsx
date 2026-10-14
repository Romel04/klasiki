import type { Metadata } from "next";
import { InfoPage, Todo } from "@/components/info/info-page";

export const metadata: Metadata = { title: "Exchange & returns" };

export default function Page() {
  return (
    <InfoPage title="Exchange & returns">
      <p><Todo>Write the real exchange / return policy: time window, condition of the bag, who pays delivery, how to request one.</Todo></p>
    </InfoPage>
  );
}
