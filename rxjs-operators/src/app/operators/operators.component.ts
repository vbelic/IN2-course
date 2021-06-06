import { Component, OnInit, ViewChild } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { from, fromEvent, interval, Observable, Subject, Subscription, timer } from 'rxjs';
import { debounceTime, delay, filter, first, groupBy, last, map, mergeMap, reduce, take, takeUntil, takeWhile, tap, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.css']
})
export class OperatorsComponent implements OnInit {

  @ViewChild(MatRipple)
  ripple!: MatRipple;

  serachInput: string="";
  radius: number = 40;

  constructor() { }

  ngOnInit(): void {
  }

  mapClick() {
    from([1, 2, 3, 4, 5, 6, 7])
      .pipe(
        map(i => i * 10),
        map(i => "Number: " + i),
        //could place infinite maps
        delay(1000)
      )
      .subscribe((i) => console.log(i))

    fromEvent(document, 'click')
      .pipe(
        // map((e: MouseEvent)=>{
        //   console.log(e);
        // })
      )
      .subscribe((pos) => console.log(pos));
  }
  //Filter the information that being generated
  filterClick() {
    from([1, 2, 3, 4, 5, 6, 7])
      .pipe(
        filter(i => i % 2 == 1)
      )
      .subscribe((pos) => console.log(pos));

    interval(1000)
      .pipe(
        filter(i => i % 2 == 0),
        map(i => 'value: ' + i),
        delay(2000)
      ).subscribe((pos) => console.log(pos));
  }
  //get the infos between the data, not to modify.
  tapClick() {
    interval(1000)
      .pipe(
        tap(i => console.log(i)),
        filter(i => i % 2 == 0),
        map(i => 'value: ' + i),
        delay(2000)
      ).subscribe((pos) => console.log(pos));
  }

  mergeMapClick() {
    const groupedPayments$ = from([
      { empDept: 'Engineering', empLoc: 'Pune', empName: 'John' },
      { empDept: 'Engineering', empLoc: 'Mumbai', empName: 'Harry' },
      { empDept: 'HR', empLoc: 'Pune', empName: 'Denis' },
      { empDept: 'Finance', empLoc: 'Mumbai', empName: 'Elvis' }
    ]).pipe(
      groupBy(person => person.empDept),
      mergeMap(group => group
        .pipe(
          reduce((acc, cur) => {
              (acc.values as any).push(cur);
              return acc;
            },
            { key: group.key, values: [] }
          )
        )
      ),
      toArray()
    );
    groupedPayments$.subscribe(console.log);
  }

  //get exact amount of elements, after getting what was defined it closes the subscription, the others usually leave it open ex: filter
  takeClick() {
    const observable = new Observable((observer) => {
      let i;
      for (i = 0; i < 20; i++) {
        setTimeout(() => {
          observer.next(Math.floor(Math.random() * 100));
        }, i * 100);

      }
      setTimeout(() => {
        observer.complete()
      }, i * 100);
    });
    const s: Subscription = observable
    .pipe(
      tap(i=>console.log(i)),
      //get the amount of elements that was defined
      //take(10)
      //take the first element
      //first()
      //passes through all and returns the last element (needs complete otherwise it's looped)
      last()
    )
    .subscribe(v=>console.log('output',v),
    (error)=>console.error(error),
    ()=>console.log('Complete')    );
    const inter = setInterval(()=>{
      console.log('Checking...');
      if(s.closed){
        console.warn('subsciption close');
        clearInterval(inter);
      }
    },200)
  }

  debonceTimeClick(){
    fromEvent(document,'click')
    .pipe(
      tap((e)=>console.log('click')),
      debounceTime(1000)
    )
    .subscribe(
      (e)=>{
        console.log(e)
        this.lauchRipple();
      }
    )
  }

  lauchRipple(){
    const rippleRef = this.ripple.launch({
      persistent:true,
      centered:true
    });
    rippleRef.fadeOut;
  }
  
  //capture what the guy wrote and drop it in subject
  serachEntry$: Subject<string> = new Subject<string>();
  search(event: any){
    this.serachEntry$.next(this.serachInput);
  }
  
  debonceTimeSearchClick(){
    this.serachEntry$
    .pipe(
      debounceTime(1000)
    )
    .subscribe((s)=>console.log(s))
  }

  //captures the value and we define how many we want it to take when it hits it closes the subscribe
  takeWhileClick(){
    interval(500)
    .pipe(
      takeWhile((value,index)=>(value<=5))
    )
    .subscribe(
      (i)=>console.log('take: ',i),
      (error)=>console.error(error),
      ()=>console.log("complete")
    )
  }

  //it needs an observable "dueTime$" and when the observable finishes the takeUntil finishes too
  //same logic as TakeWhile but here it is observable.
  takeUntilClick(){
    let dueTime$ = timer(5000);
    interval(500)
    .pipe(
      takeUntil((dueTime$))
    )
    .subscribe(
      (i)=>console.log('takeUntil: ',i),
      (error)=>console.error(error),
      ()=>console.log("complete")
    )
  }
}
