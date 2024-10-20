import prisma from "../lib/prisma";
import FormModal from "./FormModal";

export type FormContainerProps = {
  table:
    | "machine"
    | "sensor"
    | "monitoringPoint"
    | "allMonitoringPoints"
    | "sensorModel"
    | "machineType";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  if (type !== "delete") {
    switch (table) {
      case "monitoringPoint":
        const monitoringPointMachines = await prisma.machine.findMany({
          select: { id: true, name: true },
        });

        relatedData = {
          machines: monitoringPointMachines,
        };
        break;
      case "allMonitoringPoints":
        const monitoringPointSensors = await prisma.sensor.findMany({
          select: { id: true, model: true },
        });

        const monitoringPoints = await prisma.monitoringPoint.findMany({
          select: { id: true, name: true },
        });

        relatedData = {
          sensors: monitoringPointSensors,
          monitoringPoints: monitoringPoints,
        };
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
