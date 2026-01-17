import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../service/drizzle.service';
import { machinesTable } from 'src/db/schema';

@Injectable()
export class MachineRepository {
  constructor(private readonly drizzleService: DrizzleService) {}

  list(): any {
    return [
      { id: '001', name: 'AEP-001', type: 'Pump'},
      { id: '002', name: 'AEP-002', type: 'Pump'},
      { id: '003', name: 'GIP-001', type: 'Pump'},
      { id: '005', name: 'GIP-002', type: 'Pump'},
      { id: '006', name: 'TF-001', type: 'Fan'},
      { id: '007', name: 'TF-002', type: 'Fan'},
      { id: '008', name: 'TF-003', type: 'Fan'},
      { id: '009', name: 'TF-005', type: 'Fan'},
    ];
  }

  add(name: string, type: string): string {
    this.drizzleService.insert(machinesTable, [{name: name, type: type}])
    return 'Hello World!';
  }

  update(id: string, name: string, type: string): string {
    this.drizzleService.update(id, machinesTable, {name: name, type: type})
    return 'Hello World!';
  }

  delete(id: string): string {
    this.drizzleService.delete(id, machinesTable);
    return 'Hello World!';
  }
}
