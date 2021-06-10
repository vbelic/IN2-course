import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userProfile: any;
  products: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.getUserProfile();
    this.getProducts();
  }

  getUserProfile() {
    this.authService.getUserProfile().subscribe((response) => {
      this.userProfile = response;
    });
  }

  getProducts() {
    this.authService.getProducts().subscribe((response) => {
      this.products = response;
    });
  }

}
