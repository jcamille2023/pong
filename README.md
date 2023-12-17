# Ping Pong Online
An online version of Ping Pong that takes advantage of Firebase Authentication and Realtime Database to create a game where skilled players can work on their reflexes with another player on a remote computer. The Ping Pong ball moves faster each time it is hit, progressively making the game harder for both people playing the game.

![image](https://github.com/jcamille2023/pong/assets/143653842/fa6ac4ea-3426-4286-a473-9dd0c1cf5bbb)
When the site is reached, the user is automatically logged in using Firebase Authentication and is able to access any available game or create their own.


Users who create a game become "hosts", in the sense that most critical game activity, including ball movement, the declaration of a win, paddle movement, and requests to play again are handled by the host.
Users who join a a game become "clients". The only data they send to Firebase Realtime Database is their own paddle's data. A client cannot recognize when they or the host wins or ball movement, it only loads such data from the database.

![image](https://github.com/jcamille2023/pong/assets/143653842/00b117a8-b148-4b6f-92e5-0b511484f2f3)
For hosts and clients alike, when a game is created or when they join a game, they are navigated to this screen.

Whereas for hosts, the "waiting for opponent" prompt appears until their client has joined the game, clients do not receive such a prompt, as their opponent is hosting the game and their username will automatically pop up.

![image](https://github.com/jcamille2023/pong/assets/143653842/5666d13a-26b4-4013-b939-16b565ed5808)
As hosts handle critical game activity, the ability to start the game is delegated to them. When a client joins, a "start game" button appears on the host end while the client waits on the host to start the game.


When the start game button is clicked, the host and client, as designated by each player, are navigated to their own page, one being called "create.html" belonging to the host and one being called "join.html" belonging to the client. While the pages look identical, each page runs completely different scripts.
