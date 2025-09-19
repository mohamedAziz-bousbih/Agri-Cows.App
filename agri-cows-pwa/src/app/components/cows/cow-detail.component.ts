import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CowsService } from '../../core/services/cows.service';
import { Vache } from '../../models/vache';

@Component({
  selector: 'app-cow-detail',
  templateUrl: './cow-detail.component.html',
    styleUrls: ['./cow-detail.component.css']
})
export class CowDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute, private cows: CowsService) {}
  vache: Vache | null = null;
  file?: File;
  loading = true;
  saving = false;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.cows.get(id).subscribe((v) => { this.vache = v; this.loading = false; });
  }

  save() {
    if (!this.vache) return;
    this.saving = true;
    let payload: any;
    if (this.file) {
      const fd = new FormData();
      ['date_dernier_village','date_prochain_village','date_insimination','date_taghriz','historique_medical_url']
        .forEach((k) => (this.vache as any)[k] && fd.append(k, (this.vache as any)[k]));
      fd.append('historique_medical', this.file);
      payload = fd;
    } else {
      payload = {
        date_dernier_village: this.vache.date_dernier_village || null,
        date_prochain_village: this.vache.date_prochain_village || null,
        date_insimination: this.vache.date_insimination || null,
        date_taghriz: this.vache.date_taghriz || null,
        historique_medical_url: this.vache.historique_medical_url || null,
      };
    }
    this.cows.update(this.vache.id, payload).subscribe({
      next: (vv) => { this.vache = vv; this.saving = false; this.file = undefined; },
      error: () => this.saving = false
    });
  }
}
