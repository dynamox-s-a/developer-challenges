import db from "../db.json";

export function GET() {
  return Response.json(db.measurements, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
