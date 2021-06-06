import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { loadModules } from "esri-loader"; // `loadModules` dynamically injects a <script> tag onto the page
import { EsriMapService } from "../services/esri-map.service";

@Component({
  selector: "app-esri-map",
  templateUrl: "./esri-map.component.html",
  styleUrls: ["./esri-map.component.css"],
})


export class EsriMapComponent implements OnInit {
  @ViewChild("mapViewNode", { static: true }) private viewNode: ElementRef; // needed to inject the MapView into the DOM
  mapView: __esri.MapView;
  panRequestSubscription: any;

  constructor(private mapService: EsriMapService) {}

  panMap(coordinates: string) {
    this.mapView.goTo(coordinates).then(() => {
      this.mapView.zoom = 18;
      setTimeout(() => {
        this.mapService.panToWonderComplete();
      }, 2000);
    });
  }

  public async ngOnInit() {
    this.panRequestSubscription = this.mapService.panRequest.subscribe(() => {
      this.panMap(this.mapService.wonderCoordinates);
    });

    // use esri-loader to load JSAPI modules
    try {
      const [Map, MapView] = await loadModules(["esri/Map", "esri/views/SceneView", "esri/Graphic"]);
      const map: __esri.Map = new Map({
        basemap: "hybrid",
        ground: "world-elevation",
      });

      this.mapView = new MapView({
        container: this.viewNode.nativeElement,
        center: [-12.287, -37.114],
        zoom: 12,
        map: map,
      });
    } catch (err) {
      console.log(err);
    }
  }
}
