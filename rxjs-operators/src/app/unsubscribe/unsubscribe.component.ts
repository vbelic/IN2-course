import { Component, OnInit } from '@angular/core';
import { fromEvent, interval, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.css']
})
export class UnsubscribeComponent implements OnInit {

  subscriptionsActive = false;
  subsciptions: Subscription[] = [];
  unsbsAll: Subject<any> = new Subject();
  intervalId: Subscription | undefined;

  constructor() { }

  ngOnInit(): void {
    this.checkSubs();
  }

  checkSubs(){
   this.intervalId = interval(100).subscribe((e)=>{
      let active = false;
      this.subsciptions.forEach((s)=>{
        if(!s.closed){
          active = true;
        }
      });
      this.subscriptionsActive = active;
    })
  }

  subscribe() {
    const subs1 = interval(100)
    .pipe(takeUntil(this.unsbsAll))
    .subscribe((i) => {
      console.log(i);
    });
    const subs2 = fromEvent(document, 'mousemove')
    .pipe(takeUntil(this.unsbsAll))
    .subscribe((e) => {
      console.log(e);
    });
    this.subsciptions.push(subs1);
    this.subsciptions.push(subs2);
  };
  unsubscribe() {
    this.unsbsAll.next();
  }
  ngOnDestroy(){
    //is called on page destroy when exits
    if(this.intervalId != null){
      this.intervalId.unsubscribe();
    }
    //closes all subscriptions on the page.
    this.unsbsAll.next();
  }
}
