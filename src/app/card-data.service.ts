import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';

@Injectable({
  providedIn: 'root'
})
export class CardDataService {
  spreadsheetURL = "140XCKstje9kwCZ3k5k1mt4cHNT8NapT3MIBeX89mHbM";

  public cardArchetypes : Array<Archetype> = [];

  processedCardData: Map<string, CardData> = new Map<string, CardData>();
  failedCards: Array<string> = [];

  waitingResponses = 0;

  attemptLoadArchetypes(): void{
    this.googleSheetsDbService.get<ArchetypeData>(this.spreadsheetURL, "Sheet1", attributesMapping).subscribe(data => {
      var referencedCardNames = new Set<string>();
      var preloadedCardArchetypes = new Array<Archetype>();

      data.forEach((archetypeData: ArchetypeData) => {
        var exampleNames = archetypeData.examples.split(", ").map(name => name.replace(/\|/g, ","))
        exampleNames.forEach(name => referencedCardNames.add(name))

        preloadedCardArchetypes.push({
          name: archetypeData.name,
          examples: exampleNames,
          description: archetypeData.description,
          analysis: archetypeData.analysis
        })
      })

      this.preloadCards(Array.from(referencedCardNames), preloadedCardArchetypes);
    })
  }

  preloadCards(cardNames: Array<string>, preloadedCardArchetypes: Array<Archetype>): void{
    // can only handle 75 at once but dont want to implement splitting up right now

    var cardNameReduced = cardNames;
    while(cardNameReduced.length > 0){
      var cardNameArray = cardNameReduced.map(x => {return {"name": x}});

      if(cardNameArray.length > 75){
        cardNameArray = cardNameArray.slice(0, 75)
        cardNameReduced = cardNameReduced.slice(75)
      } else {
        cardNameReduced = []
      }
      
      var url = 'https://api.scryfall.com/cards/collection';
      this.waitingResponses += 1;
  
      this.http.post<ScryfallReturnCollection>(url, {"identifiers": cardNameArray}).subscribe((result:ScryfallReturnCollection) => {
        result.data.forEach((card: ScryfallReturnCard) => {
          if(card.image_uris != undefined){
            this.processedCardData.set(card.name, {imageURL: card.image_uris.normal})
          }
        })

        this.waitingResponses -= 1;
        if(this.waitingResponses == 0){
          this.cardArchetypes = preloadedCardArchetypes
          
          cardNames.forEach(name => {
            if(!this.processedCardData.has(name)){
              this.failedCards.push(name);
            }
          })
      
          if(this.failedCards.length > 0){
            console.error("Failed cards:", this.failedCards)
          }
        }
      })
    }
  }

  getCardData(cardName: string): CardData | undefined{
    if(this.processedCardData.has(cardName)){
      return this.processedCardData.get(cardName);
    }
    return undefined;
  }

  constructor(private http:HttpClient, private googleSheetsDbService: GoogleSheetsDbService) { }
}

export interface Archetype{
  name: string,
  examples: Array<string>,
  description: string,
  analysis: string
}

interface ArchetypeData{
  name: string,
  examples: string,
  description: string,
  analysis: string
}

const attributesMapping = {
  name: "Archetype",
  examples: "Examples",
  description: "Description",
  analysis: "Analysis"
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