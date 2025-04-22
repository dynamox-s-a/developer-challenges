<h1> Dynamox Monitoring System </h1>

![Home Page](https://github.com/user-attachments/assets/19b9230d-4a64-4858-8d38-2c30ee6cfd94)


## 📝Project Description

This project was developed during Dynamox Full-Stack Developer Challenge.  
The application allows users to register and manage their equipment for preventive monitoring of industrial machines by selecting the desired sensors for each machine at each monitoring point.  
The acces is limited to the authorized users.  



## 🔨 Application Features

- `Authentication to access private routes`

![Login failed](https://github.com/user-attachments/assets/57275b48-c962-41a6-852c-9791eec8994f)
![Login success](https://github.com/user-attachments/assets/21778d38-9e56-45ac-bc38-b5f7ff4fdb0e)

- `Create, edit and delete machines`  

![Machine Management](https://github.com/user-attachments/assets/a6fac5a8-61fd-41cc-8ab7-c6626f55d973)

- `Create monitoring points and sensors for an existing machine.`

![Creating monitoring points](https://github.com/user-attachments/assets/e910acee-1fa3-44b4-a452-ce822ac6e700)


- `Prevent from setting up "TcAg" and "TcAs" sensors for machines of the type "Pump"`
  
![Error in Pump machines](https://github.com/user-attachments/assets/2a9d7f52-a37a-48a8-a838-10a5611125e1)

- `List all the monitoring points in a paginated list`
  
![Monitoring points pages](https://github.com/user-attachments/assets/6559812e-697b-4227-9fe6-3a91c10eee1b)

- `Sort the monitoring points list by any of its columns in ascending or descending order`
  
![Monitoring points table](https://github.com/user-attachments/assets/4556fc21-d1c7-4d84-bd83-9a8a1a661c72)

## ▶️ Project Access
- Live at https://developer-challenges-507u.onrender.com
  - Email: admin@dynamox.com
  - password: 123456

Or...

- Download the project repository, navigate to the folder via terminal and install the necessary dependencies with npm install.

- Check if the node_modules folder has been created in the project root.

- Run the backend and frontend servers with the npm run dev

#### Database access

- Create or login in your account at MongoDB Altas
- Create a new collection
- Create an environment variables in a .env file with your url access, changing the endpoint of your collection with your password and user account
- Change the environment variable in your db.ts

## ✔️ Technologies Used

 - TypeScript
 - React
 - Redux
 - Redux Thunks 
 - Vite.
 - Material UI 5
 - NodeJS
 - MongoDB
 - Mongoose
 
