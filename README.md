# Ping Pong Online
An online version of Ping Pong that takes advantage of Firebase Authentication and Realtime Database to create a game where skilled players can work on their reflexes with another player on a remote computer. The Ping Pong ball moves faster each time it is hit, progressively making the game harder for both people playing the game.

![image](https://github.com/jcamille2023/pong/assets/143653842/fa6ac4ea-3426-4286-a473-9dd0c1cf5bbb)\
When the site is reached, the user is automatically logged in using Firebase Authentication and is able to access any available game or create their own.


Users who create a game become "hosts", in the sense that most critical game activity, including ball movement, the declaration of a win, paddle movement, and requests to play again are handled by the host.
Users who join a a game become "clients". The only data they send to Firebase Realtime Database is their own paddle's data. A client cannot recognize when they or the host wins or ball movement, it only loads such data from the database.

![image](https://github.com/jcamille2023/pong/assets/143653842/00b117a8-b148-4b6f-92e5-0b511484f2f3)\
For hosts and clients alike, when a game is created or when they join a game, they are navigated to this screen in "lobby.html". The Game ID is stored in the URL parameters, which the page uses to enter in the host as player_1 and detects when a client joins.

Whereas for hosts, the "waiting for opponent" prompt appears until their client has joined the game, clients do not receive such a prompt, as their opponent is hosting the game and their username will automatically pop up.

![image](https://github.com/jcamille2023/pong/assets/143653842/5666d13a-26b4-4013-b939-16b565ed5808)\
As hosts handle critical game activity, the ability to start the game is delegated to them. When a client joins, a "start game" button appears on the host end while the client waits on the host to start the game.



![image](https://github.com/jcamille2023/pong/assets/143653842/4fc84d61-1f78-411c-8a05-5d9719507d37)\
In the event a user accidentally navigates to the URL of a game that (a) already has a client assigned to it, or (b) does not/never existed, the lobby page will display this screen as a way of mitigating issues which may arise from the game's usage.


![image](https://github.com/jcamille2023/pong/assets/143653842/d897dc67-0cb9-4ecd-8ae8-7541a7c14454)\
When the start game button is clicked, the host and client, as designated by each player, are navigated to their own page, one being called "create.html" belonging to the host and one being called "join.html" belonging to the client. While the pages look identical, each page runs completely different scripts.


The create.html page runs a create.js script and the join.html page runs a join.js script. Create.js is the most complex script in the game and handles most critical game activity. As soon as create.js detects a user is logged in and declared the host of a game, it immediately begins the game, assigning a random direction for the ball to move in and calculating the ball's position based on a 10px/s speed in both the x and y directions. The new positions are sent to Realtime Database, where active listeners on both the create.js and the join.js scripts listen for changes and assign the ball its corresponding positions. The coordinate system for both the ball and the paddles are based on the CSS left (x) and top (y) properties. When the ball touches either the left or right side of the screen, the game is considered to have ended. If the ball touches the side belonging to player_1, player_2 has won the game and vice versa. With this in mind, create.js tracks the ball's position and enters a win into Firebase Realtime Database when a ball touches either side.

The join.js script mainly has listeners for the ball's position, the position of the paddles,  whether or not a win is declared, and whether or not a request to play again is made. The join.js script inverts the ball movement and the paddle movement belonging to the host in order to enable both the host and the client to use the left paddle to play. 

On both ends, JavaScript listeners are used to listen for when the up and down arrow keys are pressed. When the up and down arrow keys are pressed, the paddle is moved up and down respectively. This position data is sent to the Realtime Database.

![image](https://github.com/jcamille2023/pong/assets/143653842/d2389f66-700a-47d8-8ca5-073ed2070257)\
When a win is declared, both the host and the client are prompted to either go back to the main menu, or play another round using the same Game ID against the same opponent.

When either user presses "Back to main menu", that user enters into the database a field to delete the game, then is redirected to the main menu. Both scripts have listeners which listen for when this field is created. When detected, the script which detects the field deletes the instance of the game, then is redirected to the main menu.


![image](https://github.com/jcamille2023/pong/assets/143653842/963118b2-ece3-4a17-81b2-534ab7e3e6d6)
When either user presses "Play again?", that user enters into the database a field that signifies they would like to play again. When listeners attached to the field detect its creation, it notifies the other player that their opponent would like to play again and asks them if they will agree to play again. If the user presses the button, the field that had the request to play again will be changed to reflect that the other user has agreed to play again. The game is then reset and a new round begins. 
