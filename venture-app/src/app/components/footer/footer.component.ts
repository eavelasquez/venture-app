import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  topFunction(): void {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
}
