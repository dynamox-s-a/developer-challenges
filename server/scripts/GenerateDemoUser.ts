import { SensorType } from "../src/domain";
import { createMachine, createMonitoringPoint, createUser, loginUser } from "./Utils";

export async function main() {
    console.log("Creating user");
    await createUser("admin@test.com", "admin", "Admin", "Admin");
    const loginResponse = await loginUser("admin@test.com", "admin");
    const token = loginResponse.headers.get("Set-Cookie")?.split("token=")[1];
    const machine1 = await createMachine(token!, "Demo Machine 1", "pump");
    const machine1Id = await machine1.json();
    const monitoringPoint1 = await createMonitoringPoint(token!, "Demo Monitoring Point 1", SensorType.TcAg, machine1Id.id);
    const machine2 = await createMachine(token!, "Demo Machine 2", "fan");
    const machine3 = await createMachine(token!, "Demo Machine 3", "fan");
}

main();