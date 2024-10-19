import prisma from "../lib/prisma";
import FormModal from "./FormModal";

export type FormContainerProps = {
  table:
    | "machine"
    | "sensor"
    | "monitoringPoint"
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
        const monitorintPointMachines = await prisma.machine.findMany({
          select: { id: true, name: true },
        });
        relatedData = { machines: monitorintPointMachines };
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
