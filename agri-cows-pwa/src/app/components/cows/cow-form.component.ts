import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CowsService } from '../../core/services/cows.service';
@Component({
  selector: 'app-cow-form',
  templateUrl: './cow-form.component.html',
  styleUrls: ['./cow-form.component.css']
})
export class CowFormComponent {
  model: any = {
    id: 0,
    date_dernier_village: '',
    date_prochain_village: '',
    date_insimination: '',
    date_taghriz: ''
  };

  file?: File;
  saving = false;
  error = '';

  constructor(private cows: CowsService, private router: Router) {}

  save() {
    this.saving = true;

    const formData = new FormData();

    // Always send id
    formData.append('id', String(this.model.id));

    // Only send non-empty date values
    ['date_dernier_village', 'date_prochain_village', 'date_insimination', 'date_taghriz']
      .forEach(k => {
        const value = this.model[k];
        if (value) {
          formData.append(k, value);
        }
      });

    // Handle file if selected
    if (this.file) {
      formData.append('historique_medical', this.file);
    }

  formData.forEach((value, key) => {
    console.log(key, value);
  });

    this.cows.create(formData).subscribe({
      next: (v) => this.router.navigate(['/vaches', v.id]),
      error: (e) => {
        this.error = e?.error?.msg || 'Erreur';
        this.saving = false;
      }
    });
  }
}