import reducer, {
  addMachine,
  updateMachine,
  deleteMachine,
} from './machine.slices';
import { Machine } from './machine.types';

describe('machines slice', () => {
  const initialState = {
    ids: [] as string[],
    entities: {} as Record<string, Machine>,
  };

  it('returns the initial state when no action is provided', () => {
    const state = reducer(undefined, { type: 'unknown' });

    expect(state).toEqual(initialState);
  });

  it('adds a machine to the state', () => {
    const state = reducer(
      initialState,
      addMachine({ name: 'Main Pump', type: 'Pump' })
    );
    expect(state.ids).toHaveLength(1);

    const machineId = state.ids[0];
    expect(state.entities[machineId]).toMatchObject({
      id: machineId,
      name: 'Main Pump',
      type: 'Pump',
    });
  });

  it('prevents adding more than four machines', () => {
    let state = initialState;

    for (let i = 1; i <= 5; i++) {
      state = reducer(state, addMachine({ name: `Machine ${i}`, type: 'Fan' }));
    }

    expect(state.ids).toHaveLength(4);
  });

  it('updates an existing machine information', () => {
    const stateWithMachine = reducer(
      initialState,
      addMachine({ name: 'Old Machine', type: 'Pump' })
    );

    const machineId = stateWithMachine.ids[0];

    const updatedState = reducer(
      stateWithMachine,
      updateMachine({
        id: machineId,
        name: 'Updated Machine',
        type: 'Fan',
      })
    );

    expect(updatedState.entities[machineId]).toEqual({
      id: machineId,
      name: 'Updated Machine',
      type: 'Fan',
    });
  });

  it('removes a machine from the state', () => {
    const stateWithMachine = reducer(
      initialState,
      addMachine({ name: 'Temporary Machine', type: 'Pump' })
    );

    const machineId = stateWithMachine.ids[0];
    const finalState = reducer(stateWithMachine, deleteMachine(machineId));

    expect(finalState.ids).toHaveLength(0);
    expect(finalState.entities[machineId]).toBeUndefined();
  });
});
