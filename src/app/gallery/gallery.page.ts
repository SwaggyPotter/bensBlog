import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, orderBy, query, deleteDoc } from 'firebase/firestore';
import { firebaseConfig } from 'src/firebase.data';

interface GalleryItem {
  title: string;
  image: string;
  date: Date;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
  db: any;
  galleryItems: GalleryItem[] = [];
  selectedImage: GalleryItem | null = null; // Für das Modal

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }

  async ngOnInit() {
    await this.refreshGallery();
  }

  async refreshGallery() {
    // Galerie-Daten aus Firestore laden
    const postsCollection = collection(this.db, 'posts');
    const postsQuery = query(postsCollection, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(postsQuery);

    const items: GalleryItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        title: data['title'],
        image: data['image'] || 'assets/imgs/placeholder-image.jpg', // Fallback-Bild
        date: new Date(data['date']),
      });
    });

    this.galleryItems = items;

    // Aktualisierte Daten im localStorage speichern
    localStorage.setItem('galleryItems', JSON.stringify(this.galleryItems));
    console.log('Aktualisierte Galerie-Daten gespeichert:', this.galleryItems);
  }

  async openImage(item: GalleryItem) {
    try {
      const validUrl = await this.extractValidUrl(item.image);

      if (validUrl) {
        console.log('Bild öffnen mit gültiger URL:', validUrl);

        // Setze die gültige URL für das Modal
        this.selectedImage = { ...item, image: validUrl };
        console.log('Selected Image:', this.selectedImage);

        // Optional: Warte auf DOM-Update
        await new Promise((resolve) => setTimeout(resolve, 100));
      } else {
        console.warn('Ungültige URL gefunden:', item.image);
      }
    } catch (e) {
      console.error('Fehler beim Öffnen des Bildes:', e);
    }
  }


  // Funktion zur Validierung und Extraktion der zweiten URL
  async extractValidUrl(imageUrl: string): Promise<string | null> {
    try {
      const url = new URL(imageUrl);
      if (url.protocol === 'https:' && imageUrl.includes('firebasestorage.googleapis.com')) {
        return imageUrl; // Rückgabe der gültigen URL
      }
      return null; // Falls ungültig
    } catch (e) {
      console.error('Fehler beim Verarbeiten der URL:', e);
      return null; // Rückgabe null bei Fehler
    }
  }


  closeImage() {
    console.log('Modal schließen');
    this.selectedImage = null;
  }

  formatDate(date: Date | undefined): string {
    if (!date) {
      return ''; // Gib einen leeren String zurück, wenn kein Datum vorhanden ist
    }
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(date).toLocaleDateString('de-DE', options);
  }

  async loadGalleryItems() {
    const postsCollection = collection(this.db, 'posts');
    const postsQuery = query(postsCollection, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(postsQuery);

    const items: GalleryItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Prüfen, ob die URL gültig ist
      if (this.isValidUrl(data['image'])) {
        items.push({
          title: data['title'],
          image: data['image'],
          date: new Date(data['date']),
        });
      } else {
        console.warn('Ungültige URL:', data['image']);
      }
    });

    this.galleryItems = items;
    console.log('Geladene Galerie-Elemente:', this.galleryItems);

    // Speichern der aktualisierten Daten
    localStorage.setItem('galleryItems', JSON.stringify(this.galleryItems));
  }

  // Validierungsfunktion für URLs
  isValidUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'https:'; // Nur HTTPS-URLs zulassen
    } catch (e) {
      return false;
    }
  }

  async cleanUpInvalidEntries() {
    const postsCollection = collection(this.db, 'posts');
    const querySnapshot = await getDocs(postsCollection);

    querySnapshot.forEach(async (doc) => {
      const data = doc.data();
      if (!this.isValidUrl(data['image'])) {
        console.warn('Ungültigen Eintrag entfernen:', doc.id);
        await deleteDoc(doc.ref); // Dokument löschen
      }
    });
  }

}
