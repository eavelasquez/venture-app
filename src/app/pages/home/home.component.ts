import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { Category, IVenture } from '../../interfaces/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

  public ventures: Observable<IVenture[]> | undefined;
  public categories: Category[] = [];
  public subscribe: Subscription = new Subscription;

  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getVentures()
    this.subscribe = this.db.collection<Category>('categories').valueChanges().subscribe((categories) => {
      this.categories = categories
    });
    this.route.queryParams.subscribe((params) => this.getVentures(params.category));
  }

  private getVentures(category: string = '') {
    this.ventures = category.length
      ? this.db.collection<IVenture>('ventures', ref => ref.where('category', '==', category)).valueChanges()
      : this.db.collection<IVenture>('ventures').valueChanges();
  }

  getIcon(category: string = '') {
    return this.categories.find(({ slug }) => slug === category)?.icon
  }

  ngOnDestroy(): void {
    this.subscribe.unsubscribe();
  }
}
