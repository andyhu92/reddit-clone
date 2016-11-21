import { Component, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import { Article } from '../article';
import { ArticleService } from '../article.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  private articles: Observable<Article[]>;

  constructor( 
    private articleService: ArticleService,
    private route: ActivatedRoute) {
      this.articles = articleService.orderedArticles;
     }


  ngOnInit() {
    this.route.params
    .subscribe((param: Params) => {
      let source = param["sourceKey"];
      this.articleService.getArticles(source);
    });
  }

}
