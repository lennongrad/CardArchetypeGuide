import { Component, OnInit, Input } from '@angular/core';
import { Archetype, CardData, CardDataService } from '../card-data.service';

@Component({
  selector: 'app-archetype',
  templateUrl: './archetype.component.html',
  styleUrls: ['./archetype.component.less']
})
export class ArchetypeComponent implements OnInit {
  color: string = "";
  variance: number = 25;
  isDark = false;

  _archetype!: Archetype;
  exampleCards = Array<CardData | undefined>();
  @Input() set archetype(value: Archetype){
    this._archetype = value;
    
    this.exampleCards = getRandomSubarray(value.examples, 4).map(name => this.getCardData(name));

    this.color = this.randomColor();
  }

  getCardData(cardName: string): CardData | undefined{
    return this.cardDataService.getCardData(cardName)
  }

  randomColor(): string {
    // make random seed out of archetype name
    var str = this._archetype.name;
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    var randomSeed = h1^h2^h3^h4;

    // create random function out of seed
    var randomMulberry = function() {
      var t = randomSeed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };

    var currentColor: Color = {red: 200, green: 200, blue: 200};

    var colorsPresent: {[id: string] : number} = {"W": 0, "U": 0, "B": 0, "R": 0, "G": 0};
    this._archetype.examples.forEach((cardName: string) => {
      var currentCard = this.getCardData(cardName);
      currentCard?.color_identity.forEach((color: string) => {
        colorsPresent[color] += 1;
      })
    });

    var mostCommonColor = "W";
    ["W", "U", "B", "R", "G"].forEach((color: string) => {
      if(colorsPresent[color] > colorsPresent[mostCommonColor]){
        mostCommonColor = color;
      }
    });

    switch(mostCommonColor){
      case "W": currentColor = {red: 245 - this.variance, green: 245 - this.variance, blue: 245 - this.variance}; break;
      case "U": currentColor = {red: 110 + this.variance, green: 110 + this.variance, blue: 245 - this.variance}; break;
      case "B": currentColor = {red: 110 + this.variance, green: 110 + this.variance, blue: 110 + this.variance}; break;
      case "R": currentColor = {red: 245 - this.variance, green: 110 + this.variance, blue: 110 + this.variance}; break;
      case "G": currentColor = {red: 110 + this.variance, green: 245 - this.variance, blue: 110 + this.variance}; break;
    }

    currentColor.red += (.5 - randomMulberry()) * this.variance * 2;
    currentColor.green += (.5 - randomMulberry()) * this.variance * 2;
    currentColor.blue += (.5 - randomMulberry()) * this.variance * 2;

    this.isDark = Math.max(currentColor.red, currentColor.green, currentColor.blue) < 200;

    return "rgb(" + currentColor.red + "," + currentColor.green + "," + currentColor.blue + ")";
  }

  constructor(private cardDataService:CardDataService) { }

  ngOnInit(): void {
  }

}

interface Color{
  red: number, blue: number, green: number
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