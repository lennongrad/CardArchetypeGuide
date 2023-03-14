import { Component, OnInit, Input } from '@angular/core';
import { Archetype, CardData, CardDataService } from '../card-data.service';

@Component({
  selector: 'app-archetype',
  templateUrl: './archetype.component.html',
  styleUrls: ['./archetype.component.less']
})
export class ArchetypeComponent implements OnInit {
  @Input() archetype!: Archetype;

  getCardData(cardName: string): CardData | undefined{
    return this.cardDataService.getCardData(cardName)
  }

  getCardImage(cardName: string): string{
    if(this.getCardData(cardName) != undefined){
      return this.getCardData(cardName)!.imageURL
    }
    return "";
  }

  constructor(private cardDataService:CardDataService) { }

  ngOnInit(): void {
  }

}
