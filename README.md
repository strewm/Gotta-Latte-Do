# Gotta Latte Do

> https://gotta-latte-do.herokuapp.com/
> https://github.com/strewm/Gotta-Latte-Do

Gotta Latte Do is a website for keeping track of tasks.  You can make personalized lists for your tasks, give tasks to your contacts,

## Getting started

1. Clone this repository

   `git clone git@github.com:strewm/Gotta-Latte-Do.git`

2. Install dependencies

    `npm install`

3.  Create a .env file based on the .env.example given

4.  Setup your username and database based on what you setup in your .env

5. Migrate and Seed models

    `npx dotenv sequelize db:migrate`
    `npx dotenv sequelize db:seed:all`

6. Start the app using:

	`npm start`

## Database

![Database Diagram](https://imgur.com/a/JogLtyV)


