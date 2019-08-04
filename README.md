# Angular 7 Real Time Graphs

######This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8.

This project looks at implementing real time graphs using Angular 7.
It has a node server to push data to the Angular application, and the application itself has 3 different
javascript graphing libraries running simultaneously.

Doing this project, I wanted to show that it shouldn't matter what graphing library is used and that it should be
able to be slotted in and out of the application with minimum code changes. 

Making a real time graphing application raises some questions about code management, separation of concerns
and performance. In my first solution, I presumed that the server will manage what type of data to send the graphs and 
the client side would just display them 

![alt text](https://raw.githubusercontent.com/JoelSatkas/AngularRealTimeGraphs/readMeImages/Method1.png)

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

![alt text](https://raw.githubusercontent.com/JoelSatkas/AngularRealTimeGraphs/readMeImages/Method2.png)

The second solution took the control away from the service layer and gave it to the graphs. The graphs were now responsible for
dictating when they will redraw themselves, asking for data before so doing. ....
####TODO finish this
  

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

`node Server.js` in the server folder to run the data server that will push data to the Angular app.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
