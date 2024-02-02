## Full-Stack Developer Challenge - Dynamox

Access the [Deploy](https://fullstack-developer-challenge-dynamox-d87r.vercel.app/).

### Run Locally

To run locally, first, clone the repo to your local machine.

In the project folder, install the dependencies:

```bash
npm  install
```

After, run the next dev environment:

```bash
npm  run  dev
```

### Notes

Considering that all information stored in the database is fictitious and not confidential, I chose to keep the .env file containing the database and authentication key settings in the project repository.

You can log in with the user suggested on the login page or create a new user to access the application.

I considered that a monitoring point can only exist linked to a machine, therefore, to be able to create a monitoring point, it is first necessary to create a machine. Furthermore, if a machine that has monitoring points is deleted, its respective monitoring points will also be deleted.

The three sensors were inserted directly into the database, each one having a respective ID (1, 2 and 3) and being able to connect to different monitoring points.

All routes are protected, including API routes, except routes for the user to login/register.

The responsiveness didn't work properly in the production environment and I didn't have time to fix the problem.

### TODO

To make the system to prevent the user from setting up "TcAg" and "TcAs" sensors for machines of the type "Pump".

To make the table of monitoring points update automatically as soon as a machine is deleted. To do this, is needed to find out how to access the slice of monitoring points in Redux from the slice of machines.

Implement validation of the form's Select fields through Formik.

Adjust production environment responsiveness.

### Thank you

The challenge was an incredible experience and a lot of learning.

I thank the company Dynamox for the opportunity!
