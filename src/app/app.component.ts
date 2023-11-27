import { Component, HostListener, OnInit } from '@angular/core';
import { PostInterface } from './models/post.interface';
import { PostService } from './services/post.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  posts: PostInterface[] = [];
  postHeight: number = Math.round(window.innerHeight * 0.6);
  scrollSpeed = 500;
  scrollPosition = 0;
  maxScrollPosition = 0;
  private resizeObserver!: ResizeObserver;
  constructor(private postService: PostService) {}
  ngOnInit() {
    this.loadPosts();
    this.resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Here when page scrolls enough, we can remove visited posts
        if (
          entry.contentRect.height >
          window.innerHeight + window.innerHeight * 0.5
        ) {
          for (let i = 0; i < this.posts.length; i++) {
            this.posts[i].visible =
              this.posts[i].visited === true ? false : true;
          }
        }
      }
    });

    // Observe the document.documentElement for size changes
    this.resizeObserver.observe(document.documentElement);
  }

  loadPosts(isInitial: boolean = true) {
    this.postService.getPosts(isInitial).subscribe((data: PostInterface[]) => {
      this.posts = data;
    });
  }
  //listen to window resize and set posts height base on it
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.postHeight = Math.round(window.innerHeight * 0.6);
  }
  onVisible(POST: PostInterface) {
    //post gets visited
    setTimeout(() => {
      const postIndex = this.posts.indexOf(POST);
      POST.visited = true;
      this.posts[postIndex] = POST;
    }, 6000); //set a delay for posts to be marked as visited
  }
  onNearBottom(element: any) {
    // page gets near bottom
    setTimeout(() => {
      this.loadPosts(false);
    }, 0); // here we can set a delay to show new post
  }
  ngOnDestroy() {
    //stop observing page resize
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
