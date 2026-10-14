import type { Metadata } from "next";
import { InfoPage, Todo } from "@/components/info/info-page";

export const metadata: Metadata = { title: "Privacy policy" };

export default function Page() {
  return (
    <InfoPage title="Privacy policy">
      <p>When you place an order we collect your name, mobile number, delivery address and, optionally, your email. We use them only to confirm, deliver and support your order.</p>
      <p>We do not collect card or payment details on this site — payment is cash on delivery.</p>
      <p>Questions about your data: <Todo>contact email</Todo></p>
      <p><Todo>Have the owner review this policy before launch.</Todo></p>
    </InfoPage>
  );
}
