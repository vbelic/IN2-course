import { Component, OnInit } from '@angular/core';
import { from, fromEvent, interval, Observable, observable, Observer, of, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-basic-creation',
  templateUrl: './basic-creation.component.html',
  styleUrls: ['./basic-creation.component.css']
})
export class BasicCreationComponent implements OnInit {

  subscription: Subscription = new Subscription();

  constructor() { }

  ngOnInit(): void {
    console.log('oi');
  }

  observableCreate() {
    const hello = new Observable((observer: Observer<string>) => {
      observer.next('hello');
      observer.next('From');
      observer.next('Observer');
      observer.complete();
    });
    this.subscription.add(hello.subscribe(val => console.log(val)));

  }

  fromClick() {
    //Pass item by item giving next to each item
    from([1, 2, 3, 4, 5, { x: 10, y: 20 }]).subscribe((v) => console.log(v));
    //can be given subscribes both directly and subsequently
    const source = from([1, 2, 3, 4, 5, { x: 10, y: 20 }]);
    this.subscription.add(source.subscribe((v) => console.log(v)));
  }

  ofClick() {
    //the next 1 time only on the whole object
    of([1, 2, 3, 4, 5, { x: 10, y: 20 }]).subscribe((v) => console.log(v));
  }

  intervalClick() {
    const source = interval(1000);
    this.subscription.add(source.subscribe((v) => {
      console.log(v)
    }))
  }

  timmerClick() {
    //waits 3 seconds and calls every 1 second thereafter
    const source = timer(3000, 1000);
    this.subscription.add(source.subscribe((v) => {
      console.log(v)
    }))
  }
  fromEventClick() {
    const subscriptio = fromEvent(document,'click').subscribe((e)=>console.log(e));
    this.subscription.add(subscriptio);

  }
  uncubsClick() {
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
  }

  
}
