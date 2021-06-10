import { throwError } from 'rxjs';

// @Component({
//   selector: 'test',
//   template: '<h1>Test Display</h1>'
// })
// export class MockComponent {

// }

//  export const mockRoutes: Routes = [
//     {
//        path : 'login',
//        component: LoginComponent
//     },
//     {
//       path : '',
//       component:  MockComponent
//     },
//     {path : '**', redirectTo: 'login'}

//   ];

export const mockResponseObject = {};



export const mockLoginErrorResponse = throwError({});

export class MockAuthService {
  login (emailAddress: string, password: string) {

  }
}

export class MockRouter {
  navigate(commands: any[]) {

  }
}

// @Component({
//   selector: 'app',
//   template: '<router-outlet></router-outlet>'
// })
// export class MockParentComponent {

// }
