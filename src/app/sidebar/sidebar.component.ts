import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  private sources: Observable<any>;
  constructor(private articleService: ArticleService) { 
    this.sources = this.articleService.sources;
  }

  ngOnInit() {
   this.articleService.getSources();
  }

}
