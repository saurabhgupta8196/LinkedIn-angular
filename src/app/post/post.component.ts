import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  constructor(private _service: PostService) {

  }
  public edit: string = "";
  linkedIn: any = []
  public CreatePosts;
  public createPosts;
  public strObj;
  public likesCount: number;
  public likesNames = []

  content: any = [];
  islike: boolean[] = []
  public indexPost;
  data = [];

  ngOnInit() {
    this.getPosts();
  }
  getPosts() {
    this._service.getPosts().subscribe(data => {
      this.linkedIn.push(data)
      for (var i = 0; i < this.linkedIn[0].length; i++) {
        if (this.linkedIn[0][i].likes.length == 0) {
          this.islike[i] = false;
        }
        for (var j = 0; j < this.linkedIn[0][i].likes.length; j++) {
          if (this.linkedIn[0][i].likes[j].likedBy == 'hsagarthegr8')////Need to Enter username here
          {
            this.islike[i] = true;
          }

          else {
            this.islike[i] = false;
          }
        }
      }
    });

  }

  addPosts(value) {
    this.linkedIn = [];
    console.log(value);
    this.strObj = '{"content":"' + value + '"}'
    console.log(this.strObj)
    this._service.addPosts(JSON.parse(this.strObj)).subscribe(data => this.linkedIn.push(data));
    this.createPosts = "";
  }

  editPosts() {
    this.linkedIn = [];
    this.strObj = '{"content":"' + this.edit + '"}'
    this._service.editPosts(this.indexPost, JSON.parse(this.strObj)).subscribe(data => this.linkedIn.push(data));

  }
  callModal(i) {
    this.edit = this.linkedIn[0][i].content;
    this.indexPost = this.linkedIn[0][i].postId;
  }
  deletePosts(postId) {
    this.linkedIn = [];
    this._service.deletePosts(postId).subscribe(data => this.linkedIn.push(data));
  }



  likePost(uName, postId, i) {
    {
      if (this.islike[i] == false) {
        this.islike[i] = !this.islike[i];
        ////  this.color="blue";
        this.strObj = '{"userName":"saurabhgupta","postedBy":"' + uName + '","postId":"' + postId + '"}';//Need to Enter username here
        this.linkedIn[0][i].likes.push(JSON.parse(this.strObj));
        this._service.addLike(JSON.parse(this.strObj)).subscribe((data: any) => { });
      }
      else if (this.islike[i] == true) {
        this.islike[i] = !this.islike[i];
        // this.color="black";
        this.strObj = '{"userName":"saurabhgupta","postedBy":"' + uName + '","postId":"' + postId + '"}';//Need to Enter username here
        this.linkedIn[0][i].likes.pop(JSON.parse(this.strObj));
        this._service.removeLike(JSON.parse(this.strObj)).subscribe((data: any) => { });

      }
      this.likedetails(uName, postId)
    }
  }

  likedetails(uName, postId) {
    return this._service.fetchingLikes(uName, postId).subscribe((d) => { this.data = d });
  }

  /* DisplayLikes(id: string) {
     this.likesNames = [];
 
     for (let index of this.linkedIn[0]) {
 
       if (index.postId == id) {
         this.likesCount = index.likes.length;
         this.likesNames.push(index.likes[0])
       }
     }
 
 
 
   }*/



  clearData() {
    this.content = '';


  }

  postCommentData(username, postid, index) {

    //console.log(username)
    //this.name we have to userName of person who logged in from session
    this.strObj = '{"content":"' + this.content[index] + '"}';
    console.log(this.strObj);
    return this._service.postComment(username, postid, JSON.parse(this.strObj)).subscribe((d: any) => {
      this.linkedIn[0][index].comments = d[0].posts.comments
      console.log(this.linkedIn.comments)
      this.clearData();
    });
  }



}
