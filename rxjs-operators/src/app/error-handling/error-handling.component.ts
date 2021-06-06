import { Component, OnInit } from '@angular/core';
import { Observable, of, throwError, timer } from 'rxjs';
import { catchError, map, retry, retryWhen, tap, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-error-handling',
  templateUrl: './error-handling.component.html',
  styleUrls: ['./error-handling.component.css']
})
export class ErrorHandlingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

  startTest(){
    let obj: Observable<any> = new Observable((observer)=>{
     for (let i = 0; i < 10; i++) {
       if(i==7){
        observer.error("erro ocorreu na posição: "+i)
       }else{
       observer.next(i);
      }
     } 
    })
    obj
    .pipe(
      map(i=>i*10),
      tap(i=> console.log("before: "+i)),
      catchError(error=>{
         console.error('inside catherror: '+error);
         //return another value instead of the error in if, goes from complete
         //return of(0)
         //returns an error not complete
         return throwError('thoError: ');
      }),
      //how many times do you want to try to do this process, if you tried all these times and even then it gave an error and it drops the error
     // retry(2),
      //when will it try to recurre, in this case after 5 seconds it tries to recurre this request
      retryWhen(i=>timer(5000))
    )
    /**
    .subscribe(
      (i)=>console.log("normal: "+i),
      (err)=>console.error("Erro: "+err),
      ()=>console.log("complete")
    ); */
    let obj2: Observable<any> = new Observable((observer)=>{
      timer(2000).subscribe((n)=>observer.next(1000));
      timer(2000).subscribe((n)=>observer.complete());
    });
    obj2
    .pipe(
      timeout(2600)
    )
    .subscribe(
      (i)=>console.log("N: "+i),
      (err)=>console.error("Erro: "+err),
      ()=>console.log("complete")
    )
  }
}
