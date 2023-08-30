# Machine Monitoring Dashboard

This application is the coding challenge for Dynamox.

It consists of an application where a user can read, create, edit and delete Machines, as well as add and review monitoring points for those machines.

## Instructions to run

### Preparation

Create `.env` file inside `packages/frontend` folder and add the following variable:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Install packages:

```
npm i
```

### Backend

Start json-server:

```
json-server db.json -m ./node_modules/json-server-auth
```

### Frontend

The application was created using an NX monorepo.

```
nx serve frontend
```

- If you don't have NX globally installed, you might need to use `npx` to run.

## Assumptions

- The only public url is `login`. Dashboard (`/`) is an authenticated route, to which all logged users can access.
- I didn't implement a register page for new users, so you can either create a new user directly from the API, or use the ones provided.
- As it wasn't specified, all logged users have read and write permission to all machines.
- A machine can't be deleted if it's in use. I'll be assuming that a machine is in use if it has any monitoring points connected to it.
- A monitoring point will always have a sensor connected to it.
- While editing a machine, if it is of type Fan and has any monitoring points with sensor as "TcAg" or "TcAs", `type` field is not editable.

### Tools used

- I used [Devias Kit](https://mui.com/store/items/devias-kit/) as partial base for this application, for defining the theme and some base structures.
- I used redux toolkit for global state management and createAsyncThunk for handling the API calls responses.
- NextJs.
- Nx.

## Next Steps

- Implement backend: Due to my lack of availability to dedicate more hours to this challenge, I ended up using json-server instead of an actual NestJS backend application.

- Handle API errors: I did add the logic to catch API errors, and I am blocking default behavior if any happens, but I didn't add any UI feedback for that.

- Allow editing and deleting monitoring points, so it's possible to delete machines.

- Update machines reducer once a new monitoring point is created, to update the UI. -> This wasn't implemented because of the error from json-server saving the machineId as string (see Known Issues below).

- Add empty states for machines and monitoring points.

- Reduce nested levels on redux store.

- Refactor loading and error reducers to reduce repeated code.

- Update json-server to handle sorting through nested elements. It's not working to sort by machine name or machine type

- Implement tests:
  - Authentication Route:
    - Check valid credentials
    - Check if access token is being properly saved on cookies/reducer
  - Machines:
    - Validate the CRUD operations on machines.
    - Validate the API data is being properly stored on global state
  - Monitoring Points:
    - Validate the API data is being properly stored on global state

## Known Issues

- json-server: There's an open issue on json-server related to relationships on nested elements. So there is a chance that the api will save the data wrong, having the `machineId` be saved as a `string` instead of a `number`. This will cause json-server db to not connect the monitoring points to the correct machines, as the id will be different. In case this happens, you can check `db.json` and manually update the`machineId` to a number. See Issue [#925](https://github.com/typicode/json-server/issues/925)

## Final considerations

- This was my first time using Redux toolkit, and my first time using redux with TypeScript. I'm sure there was a better way to type it.

- It was also my first time using MUI with TS. I'm sure there was a better way to type it.

- I had issues with json-server, as described on `Know issues` section, which ended up contributing to some time lost trying to figure it out (which had no solution, as it's a bug on the library that wasn't fixed).
