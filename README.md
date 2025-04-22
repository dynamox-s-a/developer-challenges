<h1 align="center"> Dynamox Monitoring System </h1>


![Home Page](Home.JPG)

## Index

* [Title and Cover Image](#Title-and-Cover-Image)
* [Index](#Index)
* [Project Description](#Project-Description)
* [Application Features](#Application-Features)
* [Project Access](#project-access)
* [Technologies Used](#technologies-used)
* [Conclusion](#conclusion)

## 📝Project Description

This project was developed during Dynamox Full-Stack Developer Challenge.  
The application allows users to register and manage their equipment for preventive monitoring of industrial machines by selecting the desired sensors for each machine at each monitoring point.  
The acces is limited to the authorized users.  



## 🔨 Application Features

- `Authentication to access private routes`

![Login failed](Video_250422134149.gif)
![Login success](Video_250422133950.gif)

- `Create, edit and delete machines`  

![Machine Management](Video_250422125039.gif)


- `Create monitoring points and sensors for an existing machine.`

![Creating monitoring points](Video_250422132844.gif)

- `Prevent from setting up "TcAg" and "TcAs" sensors for machines of the type "Pump"`

![Error in Pump machines](Video_250422133327.gif)

- `List all the monitoring points in a paginated list`

![Monitoring points pages](Video_250422133536.gif)


- `Sort the monitoring points list by any of its columns in ascending or descending order`

![Monitoring points table](Video_250422132958.gif)

## ▶️ Project Access

- Download the project repository, navigate to the folder via terminal and install the necessary dependencies with npm install.

- Check that the node_modules folder has been created in the project root.

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
 
