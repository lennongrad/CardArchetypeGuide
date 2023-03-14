import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';

@Injectable({
  providedIn: 'root'
})
export class CardDataService {
  processedCardData: Map<string, CardData> = new Map<string, CardData>();
  failedCards: Array<string> = [];
  spreadsheetURL = "140XCKstje9kwCZ3k5k1mt4cHNT8NapT3MIBeX89mHbM";

  preloadCards(cardNames: Array<string>): void{
    // can only handle 75 at once but dont want to implement splitting up right now

    var cardNameArray = cardNames.map(x => {return {"name": x}});
    var url = 'https://api.scryfall.com/cards/collection';

    this.http.post<ScryfallReturnCollection>(url, {"identifiers": cardNameArray}).subscribe((result:ScryfallReturnCollection) => {
      result.data.forEach((card: ScryfallReturnCard) => {
        this.processedCardData.set(card.name, {imageURL: card.image_uris.normal})
      })

      cardNames.forEach(name => {
        if(!this.processedCardData.has(name)){
          this.failedCards.push(name);
        }
      })

      if(this.failedCards.length > 0){
        console.error("Failed cards:", this.failedCards)
      }
    })

    this.googleSheetsDbService.get<ArchetypeData>(this.spreadsheetURL, "Sheet1", attributesMapping).subscribe(data => console.log(data))
  }

  constructor(private http:HttpClient, private googleSheetsDbService: GoogleSheetsDbService) { }
}

interface ArchetypeData{
  name: string,
  examples: string
}

const attributesMapping = {
  name: "Archetype",
  example: "Examples"
}

interface ScryfallReturnCollection{
  data: Array<ScryfallReturnCard>
}

interface ScryfallReturnCard{
  name: string,
  image_uris: ScryfallImageList
}

interface ScryfallImageList{
  art_crop: string,
  large: string,
  normal: string,
  small: string
}

export interface CardData{
  imageURL: string
}