import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';

/**
 * Change this to your PCs IP address
 */
const SERVER_URL = 'http://192.168.1.11:8080';

// Socket.io events
export enum Event {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect'
}

export type pointData = {
  x: Date,
  y: number
}

export type HookLoadData = pointData[]

@Injectable({
  providedIn: 'root'
})
export class GraphDataStreamService {
  subscribers = [];
  private socket;
  private connected: boolean = false;
  private hookLoadData: HookLoadData = [];
  defaultGraphInterval: number = 60;

  constructor() {}

  public subscribeToGraph(callBack: (data) => void){
    this.initSocket();
    this.subscribers.push(callBack);
  }

  public initSocket(): void {
    if (this.connected === false) {
      this.socket = socketIo(SERVER_URL);
      this.socket.on('message', (data: any) => {
        this.onMessageReceived(data);
      });
      this.socket.on(event, (event: Event) => {
        this.onEventReceived(event);
      });
      this.connected = true;
    }
  }

  //TODO use a service worker to cache and store the data so the app can work in offline mode
  public getHookLoadDataReference(): HookLoadData {
    this.initSocket();
    return this.hookLoadData;
  }

  private onMessageReceived(data: any) {
    //Parse data if needed
    //Go through list and call the call backs
    this.subscribers.forEach((callBack) => {
      callBack(data);
    });
    this.hookLoadData.push({
      x: new Date(data[0]),
      y: parseFloat(data[1])
    });
  }

  private onEventReceived(event: Event) {
    switch (event) {
      case Event.CONNECT:
        console.log('connected to server');
        this.connected = true;
        break;
      case Event.DISCONNECT:
        console.log('disconnected to server');
        this.connected = false;
        break;
    }
  }
}
