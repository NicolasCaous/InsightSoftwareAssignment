# Running

TL;DR: `yarn install && yarn run start`

After installing the dependencies running `yarn install` (or `npm i`), just run `yarn run start` (or `npm run start`).

This was developed and tested in a Windows environment. However, this should work in both Linux and Mac as well.

![image](https://user-images.githubusercontent.com/24411365/163692993-0e178371-ba5d-45e9-8ae2-ebde3ccca47e.png)

# Development journey

At first, I wished to comply with the request of the assignment to use a tech stack that is close to what the team already uses. Therefore, my objective was to use dotnet core in the backend and vanilla javascript for the frontend.

The choice of vanilla javascript comes from the fact that the frontend doesn't have many sharing visual components and that another factor being examined in my solution is simplicity (which I assume that "the simpler, the better"). I don't see a net advantage in using a javascript library such as Angular or React for a small project in which visual elements are not prioritized. Therefore, vanilla javascript was chosen to prevent bloating the project with dependencies that it doesn't really need.

To prioritize simplicity, I decided to implement the frontend as a kind of "Immediate Mode" layout. This reduces code complexity,but comes with a performance trade-off. However, since only a few "frame" updates per second are expected, this shouldn't be an issue.

I also decided that the project would benefit from having a backend (instead of using a peer-2-peer technology such as WebRTC) because I intend to make the game a Server-Authoritative game to prevent cheating in the form of manipulating the byte stream between the client and the server or just creating a "cheating client" that would transmit invalid moves or game states. In this way, fairness is enforced and guaranteed by the server.

My next challenge was now to decide what protocol would the client and the server use. I was limited by the protocols that the browser allows a client to use. Since "real-timeness" is an obvious requirement for the game, I choose to use WebSockets as the underlying protocol ("underlying" in the sense that even if I choose to use a more abstract library, it would have to use WebSockets under the hood).

I couldn't find a WebSockets library that satisfied me with my own "simplicity requirement". The solutions that I found for dotnet involved too many parts or were too complex for my taste (SignalR, websocket-sharp, and others...). For this reason, I decided to change the backend language to javascript as well, unifying the language of the client and server, and allowing me to use [socket.io](https://socket.io/), a library that I think is the best choice for this use case.

For type safety and ease of testing, I also decided to use Typescript.

In the end, the tech stack being used is the following:

- HTML, CSS and vanilla JS for the FE;
- Typescript for the BE;
- socket.io for connecting the FE with the BE;

# Possible improvements

- Decouple networking from game logic in the backend. Currently, there is no need for that since the game logic is really simple. However, if this was a real project that would be expected to be continuously updated, decoupling is crucial to keep technical debt low.
- There is no need to send the amount of data currently being sent between the client and the server. There is certainly room for improvement to better the performance of the network.
- "Immediate Mode" layout is heavy on the CPU. Using a retained mode should be a performance improvement.
- The board state in the backend isn't really immutable. This is a limitation of javascript.
- Better error messages and sending proper errors to clients.
- Improved logging with a proper logger.

# Known issues

- The usage of `alert` instead of a proper UI modal for notifications blocks the javascript thread and causes messages coming from the server to be dropped or outdated. Too much of a hassle to fix.
- You can exploit leaving a room as many times as you want to force you to begin the game in your turn. This can't be easily fixed and would require a feature to penalize players that quit often or right at the start of the game. However, a fix for this issue isn't really required for the purpose of this assignment.
