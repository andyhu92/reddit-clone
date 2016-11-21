import { environment } from '../environments/environment';

interface ArticleJSON{
    title: string;
    url: string;
    votes: number;
    publishedAt: Date;
    descriptionL: string;
    author: string;
    urlToImage: string;
}

export class Article {
  public publishedAt: Date;

  constructor(
    public title: string,
    public description: string,
    public imageUrl: string,
    public votes?: number
  ){
    this.votes = votes || 0;
    this.publishedAt = new Date();
   }


   static fromJSON(json: ArticleJSON): Article{
       let article = Object.create(Article.prototype);
       return Object.assign(article, json, {
           votes: json.votes? json.votes : 0,
           publishedAt: json.publishedAt ?
                        new Date(json.publishedAt) :
                        new Date(),
           imageUrl: json.urlToImage ? json.urlToImage : environment.placeholderImageUrl
       });
   }


  voteUp(){
    this.votes++;
  }

  voteDown(){
    this.votes--;
  }
}
