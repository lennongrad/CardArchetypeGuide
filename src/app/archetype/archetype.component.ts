import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { CardDataService } from '../card-data.service';
import { GoogleSheetsDbService } from 'ng-google-sheets-db/lib/google-sheets-db.service';

@Component({
  selector: 'app-archetype',
  templateUrl: './archetype.component.html',
  styleUrls: ['./archetype.component.less']
})
export class ArchetypeComponent implements OnInit {

  constructor(private http:HttpClient, private cardDataService:CardDataService) { }

  ngOnInit(): void {
    this.cardDataService.preloadCards(["Bound in Gold", "Divine Gambit"])
  }

}
