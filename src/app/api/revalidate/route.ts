import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(request:NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return Response.json({ error: "Missing path" }, { status: 400 });
  }

  try {
    revalidatePath(path); // instantly revalidate this route
    return Response.json({ revalidated: true, path });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
