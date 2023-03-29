import { Component } from '@angular/core';
import { DataService } from '@shared/services/data.service';
import { Profile } from '@shared/models/profile';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  items: Profile[] = [];

  constructor(private dataService: DataService) {}
  
  ionViewWillEnter() {
    this.getItems();
  }

  hasAddress(item: Profile): number {
    return [item.city, item.state, item.street].filter(Boolean).length
  }

  getAddress(item: Profile): string {
    return [item.city, item.state, item.street].filter(Boolean).join(', ')
  }

  getItems(): void {
    this.dataService.getItems().subscribe(data => this.items = data);
  }
}
