export interface Machine {
  id: string;
  name: string;
  description: string;
  serialNumber: string;
  machineTypeId: string;
  machineType: string;
}

export const machineTypes = ["B53F0ABF-7D3B-40B8-925A-144DC694397C", "91693BD7-6D1F-40DE-9ED5-E779D201ED90", "D64B2669-C476-4965-A5DA-1CE9FF99B0CF"];
