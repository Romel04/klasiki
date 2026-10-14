import { apiJson } from "./http";

export interface District {
  id: string;
  name: string;
  deliveryCharge: number;
}

export interface Thana {
  id: string;
  name: string;
}

interface ApiDistrict {
  id: string | number;
  name: string;
  delivery_charge: string | number;
}
interface ApiThana {
  id: string | number;
  name: string;
}

export async function getDistricts(): Promise<District[]> {
  const data = await apiJson<ApiDistrict[]>("/districts", {}, "Failed to fetch districts");
  return data.map((d) => ({ id: String(d.id), name: d.name, deliveryCharge: Number(d.delivery_charge) }));
}

export async function getThanas(districtId: string): Promise<Thana[]> {
  const data = await apiJson<ApiThana[]>(`/districts/${districtId}/thanas`, {}, "Failed to fetch thanas");
  return data.map((t) => ({ id: String(t.id), name: t.name }));
}
