# shared

Code that must be identical in the web app, the API and the simulator: machine types,
sensor models and the pump rule, installation positions per type, quantities with their
units and axes, the machine tag builder and the mapping between API and database
values.

- `nx test shared` runs the unit tests with Vitest.
- `nx lint shared` runs ESLint, including the module boundary rules.
- `nx build shared` compiles the library.
