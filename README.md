# Angular 7 Real Time Graphs

`This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8.`


##Demo

![Alt text](readMeImages/demo.gif "demo")

This project looks at implementing real time graphs using Angular 7.
It has a node server to push data to the Angular application, and the application itself has 3 different
javascript graphing libraries running simultaneously.

Doing this project, I wanted to show that it shouldn't matter what graphing library is used and that it should be
able to be slotted in and out of the application with minimum code changes. 

Making a real time graphing application raises some questions about code management, separation of concerns
and performance. In my first solution, I presumed that the server will manage what type of data to send the graphs and 
the client side would just display them 

![Alt text](readMeImages/Method1.png?raw=true "Method1")

This solution kept the client side relatively simple. As soon as the service layer got a message from the web socket, it would update
the data and tell the graphs to redraw them selves. It was also easy to slot in any type of graphing library. 

Each graphing library, represented as a component, simply subscribed to the service layer. Each time the service layer got a 
message it would look at who has subscribed to him and call those who have, passing in the new data message. This way, every new
graphing component just had to create a method for handling new data and subscribe to the service layer, working immediately. 

At first this seemed like a good solution and if throttling the server and the graph re-rendering, worked pretty ok but
there were some hard flaws that were noticeable.

These flaws were adding in code to manage throttling for each graph, bad performance, a difficulty in finding 
a good smooth performance ratio for any type of device and the fact that the server could be pushing the data at any rate might
mean that there are too many web socket calls and graph redraw calls causing the app to freeze. In short, its not very robust.

My second solution attempted at addressing some of these problems.

![Alt text](readMeImages/Method2.png?raw=true "Method2")

The second solution took the control away from the service layer and gave it to the graphs. The graphs were now responsible for
dictating when they will redraw themselves, asking for data before so doing. I also added a slider for controller how regularly the graphs will
try to update them selves, this means that for low spec machines such as tablets and phones, the app can still work with a reduced
frame rate. This also opens up the opportunity for media calls to assess the capabilities of the device and turn down the defaults
when loading the app to improve performance. 

Each graph is now responsible for taking in user input, asking for new data and redrawing itself. The service layer has become a simple
middle layer for getting the data for the graphs and receiving the data from the server. 

The service layer also holds the data it receives and gives the graphs a reference to it so they can take what data they need 
to draw themselves.  

This eliminates the need for throttling as the graphs refresh rate can now be dictated by the users and have its defaults
set by the specs of the device running the app. Since the graphs are also running in their own rate, it eliminates the 
websocket and redrawing congestion. No matter what speed the websocket is filling the data buffer, the graphs will render 
at a timely fashion avoiding freezing within the app or lowering the performance. 

This also raises the possibility of an offline mode. The service layer/server worker can store the data as it receives it and 
load it up if there is no connection to the server, allowing the user to view past data.   

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

`node Server.js` in the server folder to run the data server that will push data to the Angular app.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
