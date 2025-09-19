import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MilkService } from '../../core/services/milk.service';

@Component({
  selector: 'app-milk-form',
  templateUrl: './milk-form.component.html',
  styleUrls: ['./milk-form.component.css']
})
export class MilkFormComponent implements OnInit {
  vacheId!: string;
  today: string = new Date().toISOString().split('T')[0];

  model: any = { date: '', quantite_lait_matin: 0, quantite_lait_soir: 0, remarque: '' };
  saving = false;
  error?: string;

  constructor(
    private milk: MilkService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // ✅ read vacheId from URL
    this.vacheId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.vacheId) {
      this.error = 'Aucune vache sélectionnée (id manquant)';
    }

    if (!this.model.date) {
      this.model.date = this.today;
    }
  }

  submit() {
    if (!this.vacheId) {
      this.error = "Impossible d'enregistrer : vacheId manquant.";
      return;
    }

    this.saving = true;
    this.error = undefined;

    const p = {
      date: this.model.date,
      quantite_lait_matin: Number(this.model.quantite_lait_matin || 0),
      quantite_lait_soir: Number(this.model.quantite_lait_soir || 0),
      remarque: this.model.remarque || null
    };

    this.milk.create(this.vacheId, p).subscribe({
      next: () => {
        this.saving = false;
        this.model = { date: this.today, quantite_lait_matin: 0, quantite_lait_soir: 0, remarque: '' };
      },
      error: (e) => {
        this.error = e?.error?.msg || 'Erreur';
        this.saving = false;
      }
    });
  }
}
