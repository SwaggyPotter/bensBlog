import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, orderBy, query, addDoc } from 'firebase/firestore';
import { firebaseConfig } from 'src/firebase.data';
import { getAuth } from 'firebase/auth';

interface Post {
  title: string;
  content: string;
  image: string;
  date: Date;
}

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  firebaseConfig = firebaseConfig;
  db: any;
  auth: any;

  posts: Post[] = [];
  sortedPosts: Post[] = [];

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    this.auth = getAuth(app);
    console.log('Firestore initialisiert:', this.db);
  }

  async ngOnInit() {
    // Beiträge aus Firestore laden
    this.posts = await this.loadPostsFromFirestore();

    // Beiträge nach Datum sortieren (neueste zuerst)
    this.sortedPosts = this.posts.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async loadPostsFromFirestore(): Promise<Post[]> {
    const postsCollection = collection(this.db, 'posts');
    const postsQuery = query(postsCollection, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(postsQuery);

    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        title: data['title'],
        content: data['content'],
        image: data['image'],
        date: new Date(data['date']), // Datum konvertieren
      });
    });

    console.log('Geladene Beiträge:', posts);
    return posts;
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(date).toLocaleDateString('de-DE', options);
  }
}



