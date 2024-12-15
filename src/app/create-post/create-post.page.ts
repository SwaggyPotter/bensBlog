import { Component } from '@angular/core';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage {
  title: string = '';
  content: string = '';
  image: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  db = getFirestore();

  async createPost() {
    const postsCollection = collection(this.db, 'posts');
    const newPost = {
      title: this.title,
      content: this.content,
      image: this.image || 'assets/imgs/placeholder-image.jpg',
      date: new Date().toISOString(),
    };

    try {
      await addDoc(postsCollection, newPost);
      this.successMessage = 'Beitrag erfolgreich erstellt!';
      this.title = '';
      this.content = '';
      this.image = '';
    } catch (error: any) {
      console.error('Fehler beim Erstellen des Beitrags:', error);
      this.errorMessage = 'Fehler beim Erstellen des Beitrags.';
    }
  }
}

