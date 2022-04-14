# Development journey

At first, I wished to comply with the request of the assignment to use a tech stack that is close to what the team already uses. Therefore, my objective was to use dotnet core in the backend and vanilla javascript for the frontend.

The choice of vanilla javascript comes from the fact that the frontend doesn't have many sharing visual components and that another factor being examined in my solution is simplicity (which I assume that "the simpler, the better"). I don't see a net advantage in using a javascript library such as Angular or React for a small project in which visual elements are not prioritized. Therefore, vanilla javascript was chosen to prevent bloating the project with dependencies that it doesn't really need.

I also decided that the project would benefit from having a backend (instead of using a peer-2-peer technology such as WebRTC) because I intend to make the game a Server-Authoritative game to prevent cheating in the form of manipulating the byte stream between the client and the server or just creating a "cheating client" that would transmit invalid moves or game states. In this way, fairness is enforced and guaranteed by the server.

My next challenge was now to decide what protocol would the client and the server use. I was limited by the protocols that the browser allows a client to use. Since "real-timeness" is an obvious requirement for the game, I choose to use WebSockets as the underlying protocol ("underlying" in the sense that even if I choose to use a more abstract library, it would have to use WebSockets under the hood).

I couldn't find a WebSockets library that satisfied me with my own "simplicity requirement". The solutions that I found for dotnet involved too many parts or were too complex for my taste (SignalR, websocket-sharp, and others...). For this reason, I decided to change the backend language to javascript as well, unifying the language of the client and server, and allowing me to use [socket.io](https://socket.io/), a library that I think is the best choice for this use case.

For type safety and ease of testing, I also decided to use Typescript.

In the end, the tech stack being used is the following:

- HTML, CSS and vanilla JS for the FE;
- Typescript for the BE;
- socket.io for connecting the FE with the BE;