// app/robots.txt/route.ts
export const dynamic = "force-static"; // ensures this is statically served

export async function GET() {
  return new Response(
    `User-agent: *
Allow: /
Sitemap: https://delhibookmarket.com/sitemap.xml`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
}
