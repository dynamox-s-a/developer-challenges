import json
import argparse
from datetime import datetime, timedelta, timezone


def generate_points(n):
    now = datetime.now(timezone.utc)
    points = []

    for i in range(n):
        ts = now + timedelta(seconds=i)
        points.append(
            {
                "timestamp": ts.isoformat(),
                "value": float(i % 10),
            }
        )

    return {"points": points}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--points", type=int, default=1000)
    parser.add_argument("--output", default="points.json")

    args = parser.parse_args()

    payload = generate_points(args.points)

    with open(args.output, "w") as f:
        json.dump(payload, f)

    print(f"Generated {args.points} points in {args.output}")


if __name__ == "__main__":
    main()