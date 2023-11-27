import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PostInterface } from '../models/post.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}
  private newPost: PostInterface = { id: 2, visited: false, visible: true };
  private posts: PostInterface[] = [
    { id: 1, visited: false, visible: true },
    { id: 2, visited: false, visible: true },
  ];
  getPosts(isInitial: boolean = true): Observable<PostInterface[]> {
    // Simulate an API call
    if (isInitial) {
      return of(this.posts);
    } else {
      this.newPost = {
        id: this.newPost.id + 1,
        visited: false,
        visible: true,
      };
      this.posts.push(this.newPost);
      return of(this.posts);
    }
  }
  // a fake api to get each post data
  retPost(id: number) {
    return this.http.get('https://dummyjson.com/posts/' + id);
  }
}
