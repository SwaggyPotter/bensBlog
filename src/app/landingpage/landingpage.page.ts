import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { firebaseConfig } from 'src/firebase.data';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.page.html',
  styleUrls: ['./landingpage.page.scss'],
})
export class LandingpagePage implements OnInit {
  db: any;
  latestPost: any = {
    title: 'Lade neuesten Beitrag...',
    content: '',
    image: 'assets/imgs/placeholder-image.jpg',
    date: new Date(),
  };
  formattedDate: string = '';

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }

  async ngOnInit() {
    await this.loadLatestPost();
  }

  async loadLatestPost() {
    const postsCollection = collection(this.db, 'posts');
    const postsQuery = query(postsCollection, orderBy('date', 'desc'), limit(1));
    const querySnapshot = await getDocs(postsQuery);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      this.latestPost = {
        title: data['title'],
        content: data['content'],
        image: data['image'] || 'assets/imgs/placeholder-image.jpg',
        date: new Date(data['date']),
      };

      // Formatierter Text für das Datum
      this.formattedDate = this.formatDate(this.latestPost.date);
    });
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




