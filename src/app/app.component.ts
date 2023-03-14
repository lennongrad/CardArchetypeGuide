import { Component } from '@angular/core';
import { Archetype, CardDataService } from './card-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'cardArchetypse';

  getArchetypes(): Array<Archetype>{
    return this.cardDataService.cardArchetypes;
  }

  constructor(private cardDataService:CardDataService)  {
    this.cardDataService.attemptLoadArchetypes();
  }
}
