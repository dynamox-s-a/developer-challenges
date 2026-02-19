### Auth
1. As a user, I want to be able to log out of the system so that I can prevent unauthorized access to my account.
2. No private routes should be accessible without authentication.

### Machines (after creating machine)
3. As a user, I want to change the attributes (name and type) of a machine after creating it so that I can keep the machine information updated.
4. As a user, I want to delete a machine when it is no longer in use so that it doesn't clutter the system.

### Monitoring Points
1.  As a user, I want to be able to retrieve the number of time-series I've stored in the server.


### Missing Tests:
1. As a user, I want to see all my monitoring points in a paginated list so that I can manage them. The list should display up to 5 monitoring points per page and should include the following information: "Machine Name", "Machine Type", "Monitoring Point Name", and "Sensor Model".
2. As a user, I want to sort the monitoring points list by any of its columns in ascending or descending order, so that I can easily find the information I'm looking for.
3. Make reasonable assumptions and design the application accordingly for any ambiguities in the challenge.
4. Document your assumptions in the README file.
5. Ensure correct business logic and behavior with automated unit tests. +  Implement unit tests for backend code.
6. The latency between client and the server side should be below 350ms for all requests.

### Technical Requirements Missing
1. Use React [i'm actually using react]

### General
1. Anyone should be able to follow the instructions and run the application. [✅]
2. User stories were implemented according to the functional requirements. (logout + machine update)
3. Latency API tests

