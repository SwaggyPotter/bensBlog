import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, orderBy } from 'firebase/firestore';
import { firebaseConfig } from 'src/firebase.data';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
  db: any;
  galleryItems: any[] = [];

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }

  async ngOnInit() {
    await this.loadGalleryItems();
  }

  async loadGalleryItems() {
    const postsCollection = collection(this.db, 'posts');
    const postsQuery = orderBy('date', 'desc'); // Beiträge nach Datum sortieren
    const querySnapshot = await getDocs(postsCollection);

    const items: any[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        title: data['title'],
        image: data['image'] || 'assets/imgs/placeholder-image.jpg',
        date: new Date(data['date']),
      });
    });

    this.galleryItems = items;
    console.log('Geladene Galerie-Elemente:', this.galleryItems);
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


