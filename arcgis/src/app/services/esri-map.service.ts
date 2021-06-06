import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class EsriMapService {
  panRequest = new Subject<void>();
  panComplete = new Subject<void>();

  sevenWonders = [
    { id: 0, name: "Great Wall of China", coordinates: [117.23, 40.68] },
    { id: 1, name: "Petra", coordinates: [35.44194444, 30.32861111] },
    {
      id: 2,
      name: "Christ the Redeemer",
      coordinates: [-43.210556, -22.951944],
    },
    { id: 3, name: "Machu Picchu", coordinates: [-72.545556, -13.163333] },
    { id: 4, name: "Chichen Itza", coordinates: [-88.568611, 20.683056] },
    { id: 5, name: "Colosseum", coordinates: [12.492269, 41.890169] },
    { id: 6, name: "Taj Mahal", coordinates: [78.041944, 27.175] },
    { id: 7, name: "La Bastida", coordinates: [37.760232, -1.558331] },
  ];

  wonderCoordinates: any;

  panToWonder(wonderCoordinates: any) {
    this.wonderCoordinates = wonderCoordinates;
    this.panRequest.next();
  }

  panToWonderComplete() {
    this.panComplete.next();
  }

  constructor() {}
}
