#!/usr/bin/env python3
"""Ponte JSONL <-> rosbag da aquisicao confirmatoria (F8).

Uso:
  rosbag_bridge.py to-bag   --in acquisition.jsonl --out acquisition.bag
  rosbag_bridge.py from-bag --in acquisition.bag   --out reconstructed.jsonl

Geracao 100% offline via rosbag.Bag: sem roscore, sem Gazebo, sem nos permanentes.
O bag e proveniencia/replay de UMA aquisicao ja escolhida pelo supervisor — nunca um
segundo simulador. Topicos minimos:

  /sensors/<id>/imu          sensor_msgs/Imu       (linear_acceleration = RMS janelado
                                                    em g dos eixos x/y/z — mapeamento
                                                    didatico declarado na proveniencia)
  /sensors/<id>/temperature  sensor_msgs/Temperature (degC)
  /<machine>/rpm             std_msgs/Float64        (rotacao; timestamp = tempo do
                                                      registro no bag)
  /sensors/<id>/provenance   std_msgs/String         (envelope JSON: acquisition +
                                                      series, origin = simulation)

A identidade semantica vive no JSONL/payload (fingerprint recomputado no TypeScript);
bytes do .bag NUNCA sao a identidade. Requer ROS Noetic (Python 3.8):
  PYTHONPATH=/opt/ros/noetic/lib/python3/dist-packages LD_LIBRARY_PATH=/opt/ros/noetic/lib
"""
import argparse
import calendar
import json
import sys
from datetime import datetime

import rosbag
import rospy
from sensor_msgs.msg import Imu, Temperature
from std_msgs.msg import Float64, String

ISO_FORMAT = "%Y-%m-%dT%H:%M:%S.%fZ"


def iso_to_time(iso):
    """ISO canonico (milissegundos, UTC) -> rospy.Time exato."""
    dt = datetime.strptime(iso, ISO_FORMAT)
    secs = calendar.timegm(dt.timetuple())
    nsecs = dt.microsecond * 1000
    return rospy.Time(secs, nsecs)


def time_to_iso(stamp):
    """rospy.Time -> ISO canonico com exatamente 3 casas de milissegundo."""
    if stamp.nsecs % 1_000_000 != 0:
        raise SystemExit(
            "bag com precisao abaixo de milissegundo (nsecs=%d) — fora do contrato canonico" % stamp.nsecs
        )
    base = datetime.utcfromtimestamp(stamp.secs).strftime("%Y-%m-%dT%H:%M:%S")
    return "%s.%03dZ" % (base, stamp.nsecs // 1_000_000)


def read_jsonl(path):
    records = []
    with open(path, "r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if line:
                records.append(json.loads(line))
    return records


def dumps(record):
    return json.dumps(record, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def index_records(records):
    acquisitions = [r for r in records if r.get("type") == "acquisition"]
    series = sorted((r for r in records if r.get("type") == "series"), key=lambda r: r["index"])
    samples = [r for r in records if r.get("type") == "sample"]
    if len(acquisitions) != 1:
        raise SystemExit("esperado exatamente 1 registro acquisition, ha %d" % len(acquisitions))
    acq = acquisitions[0]
    if acq.get("origin") != "simulation":
        raise SystemExit("artefato sem origin=simulation — recusado (nunca parecer aquisicao fisica)")
    return acq, series, samples


def samples_of(samples, index):
    return sorted(
        (s for s in samples if s["series"] == index),
        key=lambda s: s["timestamp"],
    )


def to_bag(in_path, out_path):
    acq, series, samples = index_records(read_jsonl(in_path))
    ros_plan = acq["ros"]
    sensor_ns = "/" + ros_plan["sensorNamespace"]
    rpm_topic = "/" + ros_plan["machineTopic"] + "/rpm"
    frame_id = ros_plan["frameId"]

    def series_by(quantity, axis=None):
        for s in series:
            attrs = s["attributes"]
            if attrs["physicalQuantity"] == quantity and attrs.get("axis") == axis:
                return s
        raise SystemExit("serie %s/%s ausente no artefato" % (quantity, axis))

    acc = {axis: samples_of(samples, series_by("acceleration", axis)["index"]) for axis in ("x", "y", "z")}
    temp_samples = samples_of(samples, series_by("temperature")["index"])
    rpm_samples = samples_of(samples, series_by("rotationalSpeed")["index"])

    stamps = [s["timestamp"] for s in acc["x"]]
    for axis in ("y", "z"):
        if [s["timestamp"] for s in acc[axis]] != stamps:
            raise SystemExit("eixos de aceleracao com timestamps divergentes — artefato invalido")

    topics = set()
    count = 0
    with rosbag.Bag(out_path, "w") as bag:
        def write(topic, msg, t):
            nonlocal count
            bag.write(topic, msg, t)
            topics.add(topic)
            count += 1

        envelope = String()
        envelope.data = dumps({"acquisition": acq, "series": series})
        write(sensor_ns + "/provenance", envelope, iso_to_time(stamps[0]))

        for i, iso in enumerate(stamps):
            t = iso_to_time(iso)
            imu = Imu()
            imu.header.stamp = t
            imu.header.frame_id = frame_id
            imu.linear_acceleration.x = acc["x"][i]["value"]
            imu.linear_acceleration.y = acc["y"][i]["value"]
            imu.linear_acceleration.z = acc["z"][i]["value"]
            # Convencao ROS: covariancia[0] = -1 sinaliza campo nao medido (orientacao/giro).
            imu.orientation_covariance[0] = -1.0
            imu.angular_velocity_covariance[0] = -1.0
            write(sensor_ns + "/imu", imu, t)

        for sample in temp_samples:
            t = iso_to_time(sample["timestamp"])
            msg = Temperature()
            msg.header.stamp = t
            msg.header.frame_id = frame_id
            msg.temperature = sample["value"]
            msg.variance = 0.0
            write(sensor_ns + "/temperature", msg, t)

        for sample in rpm_samples:
            msg = Float64()
            msg.data = sample["value"]
            write(rpm_topic, msg, iso_to_time(sample["timestamp"]))

    print(dumps({"messages": count, "topics": sorted(topics)}))


def from_bag(in_path, out_path):
    envelope = None
    imu_msgs = []
    temp_msgs = []
    rpm_msgs = []
    topics = set()
    count = 0
    with rosbag.Bag(in_path, "r") as bag:
        for topic, msg, t in bag.read_messages():
            topics.add(topic)
            count += 1
            if topic.endswith("/provenance"):
                if envelope is not None:
                    raise SystemExit("bag com mais de um envelope de proveniencia")
                envelope = json.loads(msg.data)
            elif topic.endswith("/imu"):
                imu_msgs.append(msg)
            elif topic.endswith("/temperature"):
                temp_msgs.append(msg)
            elif topic.endswith("/rpm"):
                rpm_msgs.append((msg, t))
            else:
                raise SystemExit("topico inesperado no bag: %s" % topic)

    if envelope is None:
        raise SystemExit("bag sem envelope de proveniencia — reconstrucao impossivel")
    acq = envelope["acquisition"]
    series = envelope["series"]
    if acq.get("origin") != "simulation":
        raise SystemExit("bag sem origin=simulation — recusado")

    def index_of(quantity, axis=None):
        for s in series:
            attrs = s["attributes"]
            if attrs["physicalQuantity"] == quantity and attrs.get("axis") == axis:
                return s["index"]
        raise SystemExit("serie %s/%s ausente no envelope" % (quantity, axis))

    samples = []
    for msg in imu_msgs:
        iso = time_to_iso(msg.header.stamp)
        for axis, value in (("x", msg.linear_acceleration.x),
                            ("y", msg.linear_acceleration.y),
                            ("z", msg.linear_acceleration.z)):
            samples.append({"type": "sample", "series": index_of("acceleration", axis),
                            "timestamp": iso, "value": value})
    for msg in temp_msgs:
        samples.append({"type": "sample", "series": index_of("temperature"),
                        "timestamp": time_to_iso(msg.header.stamp), "value": msg.temperature})
    for msg, t in rpm_msgs:
        samples.append({"type": "sample", "series": index_of("rotationalSpeed"),
                        "timestamp": time_to_iso(t), "value": msg.data})

    samples.sort(key=lambda s: (s["series"], s["timestamp"]))

    with open(out_path, "w", encoding="utf-8") as handle:
        handle.write(dumps(acq) + "\n")
        for s in series:
            handle.write(dumps(s) + "\n")
        for s in samples:
            handle.write(dumps(s) + "\n")

    print(dumps({"messages": count, "topics": sorted(topics)}))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=["to-bag", "from-bag"])
    parser.add_argument("--in", dest="in_path", required=True)
    parser.add_argument("--out", dest="out_path", required=True)
    args = parser.parse_args()
    if args.mode == "to-bag":
        to_bag(args.in_path, args.out_path)
    else:
        from_bag(args.in_path, args.out_path)


if __name__ == "__main__":
    sys.exit(main())
