# QA Challenge - Sensor Dashboard

End-to-End (E2E) test automation project developed for the QA technical challenge. The goal is to ensure the quality and correct rendering of sensor data (RMS Acceleration, Temperature, and RMS Velocity).

## 🛠️ Technologies Used

- **[Cypress](https://www.cypress.io/)**: Framework chosen for E2E automation due to its excellent network interception and DOM manipulation capabilities.
- **Node.js**: Execution environment.
- **JavaScript**: Base language for writing the tests.

## 📂 Project Structure

An isolated and easily maintainable structure was chosen, ideal for a scenario where the QA validates the interface without direct access to modify the source code (black-box testing):

- `/cypress/e2e`: Contains the test files (`.cy.js`) with UI and behavior validations.
- `/cypress/fixtures`: Contains the Mocks (`data.json` and `metadata.json`) to isolate tests from real API instabilities.
- `/docs`: Contains additional technical reports required by the challenge (Bug Reports and Design Feedback).

## 🚀 How to Install and Run

Follow the steps below to run the project locally on your machine.

**1. Install dependencies:**
At the root of the project, run:
\`\`\`bash
npm install
\`\`\`

**2. To open the interactive Cypress interface (Headed Mode):**
\`\`\`bash
npx cypress open
\`\`\`
*In the setup wizard, select "E2E Testing", choose your preferred browser (e.g., Chrome), and click on the `dashboard.cy.js` file.*

**3. To run tests in the background (Headless Mode):**
Ideal for CI/CD pipelines:
\`\`\`bash
npx cypress run
\`\`\`

## 📝 Additional Documentation (Theoretical Requirements)

As part of the evaluation of critical product and quality vision, I documented scenarios found during the manual exploration of the application:

1. **Bug Report (Developer):** A real defect found in the rendering of the Temperature chart tooltip. Details in [docs/bug_report.md](./docs/bug_report.md).
2. **Design Feedback:** Questions about states not mapped in the prototype (Loading and Error states). Details in [docs/designer_feedback.md](./docs/designer_feedback.md).

---
*Developed by Matheus Gabriel da Silva*