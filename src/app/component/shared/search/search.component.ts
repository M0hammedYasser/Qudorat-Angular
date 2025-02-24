import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  enterSearchValue: any;

  @Output()
  searchTextChange:EventEmitter<string>=new EventEmitter<string>()

  onSearchTextChange(){
    this.searchTextChange.emit(this.enterSearchValue)
  }

}
