IF NOT EXISTS (
    SELECT name 
    FROM sys.databases 
    WHERE name = N'FullStackDevelopmentChallenge'
)
BEGIN
    CREATE DATABASE FullStackDevelopmentChallenge;
END
GO

USE FullStackDevelopmentChallenge;
GO

IF NOT EXISTS (
    SELECT * FROM sysobjects 
    WHERE name = 'MachineTypes' AND xtype = 'U'
)
BEGIN
    CREATE TABLE MachineTypes (
        Id UNIQUEIDENTIFIER PRIMARY KEY, 
        TypeName NVARCHAR(50) NOT NULL UNIQUE
    );

    INSERT INTO MachineTypes (Id, TypeName)
    VALUES (NEWID(), 'Press'),
           (NEWID(), 'Lathe'),
           (NEWID(), 'Milling Machine');
END
GO

IF NOT EXISTS (
    SELECT * FROM sysobjects 
    WHERE name = 'Machines' AND xtype = 'U'
)
BEGIN
    CREATE TABLE Machines (
        Id UNIQUEIDENTIFIER PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        SerialNumber NVARCHAR(50) NOT NULL UNIQUE,
        Description NVARCHAR(255) NULL,
        MachineTypeId UNIQUEIDENTIFIER NOT NULL,
        FOREIGN KEY (MachineTypeId) REFERENCES MachineTypes(Id)
    );
END
GO
