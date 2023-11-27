import { Component, Input, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { PostService } from '../services/post.service';
import { PostDetail } from '../models/postDetail.interface';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() postId: number = 0;
  @Input() postHeight: number = 200;
  postDetail = {} as PostDetail;
  constructor(private postService: PostService) {}
  ngOnInit(): void {
    this.retPost();
  }
  retPost() {
    const call = this.postService.retPost(this.postId);
    lastValueFrom(call).then((post: any) => {
      this.postDetail = post;
    });
  }
}
