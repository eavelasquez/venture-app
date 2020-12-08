import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category, IVenture } from '../../interfaces/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  public ventures: Observable<IVenture[]> | undefined;
  public categories: Observable<Category[]> | undefined;

  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getVentures()
    this.categories = this.db.collection<Category>('categories').valueChanges();
    this.route.queryParams.subscribe((params) => this.getVentures(params.category));
  }

  private getVentures(category: string = '') {
    this.ventures = category.length
      ? this.db.collection<IVenture>('ventures', ref => ref.where('category', '==', category)).valueChanges()
      : this.db.collection<IVenture>('ventures').valueChanges();
  }
}
