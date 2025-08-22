export async function pincodeChecker(pincode: string) {
  if (!/^\d{6}$/.test(pincode)) {
    throw new Error("Invalid pincode format");
  }

  const API_KEY = process.env.DATA_GOV_API_KEY || "579b464db66ec23bdd00000146a36d10db454b4766733bff74456aee";
  const RESOURCE_ID = "04cbe4b1-2f2b-4c39-a1d5-1c2e28bc0e32";

  const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json&filters[pincode]=${pincode}`;

  const res = await fetch(url, { cache: "no-store" }); // no-store ensures fresh fetch in Next.js
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  const data = await res.json();

  // return the first record (state + district etc.)
  return data?.records?.[0] || null;
}
