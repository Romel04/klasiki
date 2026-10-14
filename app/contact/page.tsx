import type { Metadata } from "next";
import { InfoPage, Todo } from "@/components/info/info-page";

export const metadata: Metadata = { title: "Contact" };

export default function Page() {
  return (
    <InfoPage title="Contact">
      <p>We&apos;re happy to help with orders, delivery and anything about our bags.</p>
      <p>Phone / WhatsApp: <Todo>phone number</Todo></p>
      <p>Email: <Todo>email address</Todo></p>
      <p>Facebook &amp; Instagram: <Todo>page links</Todo></p>
      <p>Hours: <Todo>support hours</Todo></p>
    </InfoPage>
  );
}
