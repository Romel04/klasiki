import type { Metadata } from "next";
import { InfoPage, Todo } from "@/components/info/info-page";

export const metadata: Metadata = { title: "Shipping & delivery" };

export default function Page() {
  return (
    <InfoPage title="Shipping & delivery">
      <p>We deliver across Bangladesh. Payment is cash on delivery.</p>
      <p>The delivery charge depends on your district and is shown at checkout before you place your order.</p>
      <p>Delivery time: <Todo>estimated days inside Dhaka / outside Dhaka</Todo></p>
      <p>After you order, we contact you to confirm it. Confirmation is done via bKash.</p>
      <p>You can follow your order any time on the Track order page.</p>
    </InfoPage>
  );
}
