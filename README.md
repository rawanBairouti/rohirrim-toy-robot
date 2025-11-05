
# Rohirrim Take Home Assessment - Toy Robot Simulator

## overview

This is a monorepo that contains both the client and server of the app.

The client was created using Reactjs with Typescript, while the backend was created using Nestjs and an SQLite database.

To run the application, simply clone the repe, then run the following commands in the root directory:

`npm install`

`npm run dev`

The client and server should now both be running in the IDE terminal. After that, navigate to <http://localhost:5173>

## App Instructions

- Click on any square to place the first robot.
- The on-screen buttons can be used to change directions and move the robot as instructed in the specifications.
- Using the arrow keys can move the robot as well: First click on the arrow changes the direction, subsequent clicks in the same direction moves the robot.
- Clicking on another space removes the robot from the screen, and creates a new one in the new spot with new history and a new ID.
- First launch doesn't show any robots. Subsquent launches and refreshes of the page show the last saved robot.
- The 'right' and 'left' movement of the robot follow intuitive order of moving a game piece, rathen than a full circle.
- I added a 'History' button that shows the recent moves of the current robot, to demonstrate the positions being saved into the database and pulled correctly.

## Testing

- I would want to write a lot of unit tests for both the fontend and especially the backend, but it would take a long time to write them all.
I wrote a few examples for the Table component. To run the tests, navigate to apps/client then run:   `npm run test Table`
