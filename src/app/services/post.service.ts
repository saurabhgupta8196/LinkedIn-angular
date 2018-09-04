import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/Http';

import { Observable } from 'rxjs';
import { IPost } from '../post/IPost';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  public _urlPosts = 'http://localhost:8080/rest-api/users/post/load'
  public _urlCreate = 'http://localhost:8080/rest-api/users/create/post';
  public _urlLikePost = 'http://localhost:8080/rest-api/users/post/like';
  public _urlUnLikePost = 'http://localhost:8080/rest-api/users/post/unlike';

  public _urlEditPost = 'http://localhost:8080/rest-api/users/edit/post/';
  public _urlDeletePost = 'http://localhost:8080/rest-api/users/delete/posts/';

  constructor(private http: HttpClient) { }


  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(this._urlPosts);
  }

  addPosts(value): Observable<any[]> {
    return this.http.patch<any[]>(this._urlCreate, value) // take username from session
  }

  addLike(objValue): Observable<any[]> {
    return this.http.post<any[]>(this._urlLikePost, objValue);
  }

   removeLike(objValue):Observable<any[]>{
    return this.http.post<any[]>(this._urlUnLikePost,objValue);
  }

   fetchingLikes(pName,pId):Observable<IPost[]>{
   return this.http.get<IPost[]>('http://localhost:8080/rest-api/users/post/getLikesdetails/'+pName+'/'+pId)
}

  editPosts(postId,value): Observable<any[]> {
    return this.http.patch<any[]>(this._urlEditPost + postId, value) // take username from session
  }

deletePosts(postId){
 return this.http.patch<any[]>(this._urlDeletePost + postId,{}) // take username from session
}

  postComment(username,postid,data):Observable<IPost[]>{ 
    var result =  this.http.put<IPost[]>('http://localhost:8080/rest-api/users/post/updateComments/'+username+'/'+postid,data);
    console.log(result);
    return result;
  }

}
