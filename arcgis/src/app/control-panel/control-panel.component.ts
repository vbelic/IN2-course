import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Subscription } from "rxjs";
import { EsriMapService } from "../services/esri-map.service";

@Component({
  selector: "app-control-panel",
  templateUrl: "./control-panel.component.html",
  styleUrls: ["./control-panel.component.css"],
})
export class ControlPanelComponent implements OnInit, OnDestroy {
  feedback: string;
  sevenWonders = this.mapService.sevenWonders;
  panCompleteSubscription: Subscription;
  wonderFormSubscription: Subscription;

  // Instantiate a FormControl, with an initial value of nothing.
  wonderForm = new FormControl("");

  disablePanel(name: string) {
    this.wonderForm.disable({ emitEvent: false });
    this.feedback = "Panning to " + name + ".";
  }

  enablePanel() {
    this.wonderForm.enable({ emitEvent: false });
    this.feedback = "Done!";
    setTimeout(() => {
      this.feedback = "";
    }, 1000);
  }

  constructor(private mapService: EsriMapService) {}

  ngOnInit() {
    this.panCompleteSubscription = this.mapService.panComplete.subscribe(() => {
      this.enablePanel();
    });

    this.wonderFormSubscription = this.wonderForm.valueChanges.subscribe(
      (wonder) => {
        console.log("location selected:", this.sevenWonders[wonder].name);

        // verify that a location is selected
        if (!wonder) {
          return;
        }

        // disable the panel
        this.disablePanel(this.sevenWonders[wonder].name);

        // call the panMap method of the child map component
        this.mapService.panToWonder(this.sevenWonders[wonder].coordinates);
      }
    );
  }

  // clean up any subscriptions
  ngOnDestroy() {
    this.panCompleteSubscription.unsubscribe();
    this.wonderFormSubscription.unsubscribe();
  }
}
