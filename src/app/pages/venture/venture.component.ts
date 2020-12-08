import { Component, OnInit } from '@angular/core';
import { Venture } from '../../models/models';
import { NgForm, NgModel } from '@angular/forms';
import { Category, IVenture } from '../../interfaces/interfaces';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-venture',
  templateUrl: './venture.component.html',
  styles: [`
    .ng-valid[required], .ng-valid.required  {
      border-left: 5px solid #42A948; /* green */
    }

    .ng-invalid:not(form)  {
      border-left: 5px solid #a94442; /* red */
    }
  `]
})
export class VentureComponent implements OnInit {

  public success: boolean = false;
  public message: string = '';
  public venture: Venture = new Venture()
  public categories: Observable<Category[]> | undefined;
  private venturesCollection: AngularFirestoreCollection<IVenture>;

  constructor(private db: AngularFirestore) {
    this.venturesCollection = db.collection<IVenture>('ventures');
  }

  ngOnInit(): void {
    this.categories = this.db.collection<Category>('categories').valueChanges();
  }

  public onSubmit(form: NgForm): void {
    if (form.invalid) { return ; }
    const id = this.db.createId();
    this.venturesCollection.add({ id, ...form.value }).then(() => {
      form.reset();
      this.success = true;
      this.message = 'Se creó correctamente el emprendimiento.';
    }).catch(() => {
      this.success = false;
      this.message = 'Ocurrió un error creando el emprendimiento.';
    })
  }

  public getErrorMessage(field: NgModel): string {
    return field.hasError('required') ? 'Debes ingresar un valor.'
      : field.hasError(('minlength')) ? `El tamaño mínimo es '${field.control?.errors?.minlength?.requiredLength}'.`
        : field.hasError(('pattern')) ? 'El formato no es correcto.'
          : '';
  }
}
