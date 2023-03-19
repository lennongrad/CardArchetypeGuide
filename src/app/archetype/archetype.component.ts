import { Component, OnInit, Input } from '@angular/core';
import { Archetype, CardData, CardDataService } from '../card-data.service';

@Component({
  selector: 'app-archetype',
  templateUrl: './archetype.component.html',
  styleUrls: ['./archetype.component.less']
})
export class ArchetypeComponent implements OnInit {
  _archetype!: Archetype;
  exampleCards = Array<CardData | undefined>();
  @Input() set archetype(value: Archetype){
    this._archetype = value;
    
    this.exampleCards = getRandomSubarray(value.examples, 4).map(name => this.getCardData(name))
  }

  getCardData(cardName: string): CardData | undefined{
    return this.cardDataService.getCardData(cardName)
  }

  constructor(private cardDataService:CardDataService) { }

  ngOnInit(): void {
  }

}

function getRandomSubarray(arr: Array<any>, size: number) {
  var shuffled = arr.slice(0), i = arr.length, temp, index;
  while (i--) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
}