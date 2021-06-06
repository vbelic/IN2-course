import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { AppService } from './app.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loadedCharacter: {};
  constructor(private http: HttpClient, private readonly service: AppService) { }

  ngOnInit() {
    // // let character = this.http.get('https://swapi.dev/api/people/1/');
    // // let characterHomeworld = this.http.get('https://swapi.dev/api/planets/1/');

    let character = this.service.getPeopleById(1);
    let characterHomeworld = this.service.getPlanetsById(1);

    forkJoin([character, characterHomeworld]).subscribe(results => {
      // results[0] is our character
      // results[1] is our character homeworld
      (results[0] as any).homeworld = results[1];
      this.loadedCharacter = results[0];
    });
  }
}
