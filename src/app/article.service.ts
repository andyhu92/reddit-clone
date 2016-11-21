import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Article } from './article';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { environment } from '../environments/environment';

interface ArticleSortFn{
  (a: Article, b: Article): number;
}

interface ArticleSortOrderFn{
  (direction: number):ArticleSortFn;
}

const sortByTime: ArticleSortOrderFn = 
  (direction:number) => (a:Article, b:Article)=>{
    return direction *
      (b.publishedAt.getTime() - a.publishedAt.getTime());
  }

const sortByVotes: ArticleSortOrderFn = 
  (direction:number) => (a:Article, b:Article)=>{
    return direction *
      (b.votes - a.votes);
  }

const sortFns = {
  'Time': sortByTime,
  'Votes':sortByVotes
}

@Injectable()
export class ArticleService {
  private _articles: BehaviorSubject<Article[]> = 
    new BehaviorSubject<Article[]>([]);

  private _sources: BehaviorSubject<any> = 
    new BehaviorSubject<any>([]);

  private _sortByDirectionSubject: BehaviorSubject<number> 
  = new BehaviorSubject<number>(1);

  private _sortByFilterSubject: BehaviorSubject<ArticleSortOrderFn> 
  = new BehaviorSubject<ArticleSortOrderFn>(sortByTime);

  private _filterBySubject: BehaviorSubject<string> 
  = new BehaviorSubject<string>('');


  articles: Observable<Article[]> = this._articles.asObservable();
  sources: Observable<any> = this._sources.asObservable();

  orderedArticles: Observable<Article[]>;


  constructor(
    private http: Http
  ) { 
    this.orderedArticles = 
      Observable.combineLatest(
        this._articles,
        this._sortByFilterSubject,
        this._sortByDirectionSubject,
        this._filterBySubject
      ).map(([articles, sorter, direction, filterStr]) => {
        const regex = new RegExp(filterStr, 'gi');
        return articles
          .filter(a => regex.exec(a.title))
          .sort(sorter(direction));
      })
  }

  sortBy(filter: string, direction: number): void{
     this._sortByDirectionSubject.next(direction);
     this._sortByFilterSubject.next(sortFns[filter]);
  }

  filterBy(filter: string): void{
     this._filterBySubject.next(filter);
  }

  getArticles(source: string): void{
    this._makeHttpRequest('/v1/articles', source)
      .map(json => json.articles)
      .subscribe(articlesJSON => {
        const articles = articlesJSON
          .map(articlejson => Article.fromJSON(articlejson));
        this._articles.next(articles);
      })
  }

   getSources(): void{
    this._makeHttpRequest('/v1/sources')
      .map(json => json.sources)
      .filter(list => list.length > 0)
      .subscribe(this._sources);
  }

  private _makeHttpRequest(
    path: string,
    sourceKey?: string
  ): Observable<any>{
    let params = new URLSearchParams();
    params.set("apiKey",environment.newsApiKey);
    if(sourceKey && sourceKey !== '')
      params.set("source",sourceKey);
    return this.http
            .get(`${environment.baseUrl}${path}`,
            {
              search:params
            })
            .map(res => res.json());
   }
}

