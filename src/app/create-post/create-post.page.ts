import { Component } from '@angular/core';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage {
  title: string = '';
  content: string = '';
  selectedFile: File | null = null; // Zum Speichern der ausgewählten Datei
  uploadSuccessMessage: string = '';
  errorMessage: string = '';
  imageUrl: string = ''; // URL des hochgeladenen Bildes
  db = getFirestore();

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('Ausgewählte Datei:', this.selectedFile);
  }

  async uploadImage() {
    if (!this.selectedFile) {
      this.errorMessage = 'Bitte wähle eine Datei aus.';
      return;
    }

    const storage = getStorage();
    const storageRef = ref(storage, `images/${this.selectedFile.name}`); // Speicherpfad

    try {
      const uploadTask = uploadBytesResumable(storageRef, this.selectedFile);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          console.log('Upload läuft...', snapshot.bytesTransferred);
        },
        (error) => {
          console.error('Fehler beim Upload:', error);
          this.errorMessage = 'Fehler beim Upload.';
        },
        async () => {
          this.imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('Bild erfolgreich hochgeladen:', this.imageUrl);
          this.uploadSuccessMessage = 'Bild erfolgreich hochgeladen!';
        }
      );
    } catch (error) {
      console.error('Fehler beim Hochladen:', error);
      this.errorMessage = 'Fehler beim Hochladen.';
    }
  }

  async createPost() {
    if (!this.imageUrl) {
      this.errorMessage = 'Bitte lade ein Bild hoch.';
      return;
    }

    const postsCollection = collection(this.db, 'posts');
    try {
      await addDoc(postsCollection, {
        title: this.title,
        content: this.content,
        image: this.imageUrl, // URL des hochgeladenen Bildes speichern
        date: new Date().toISOString(),
      });
      this.uploadSuccessMessage = 'Beitrag erfolgreich erstellt!';
      this.errorMessage = '';
      this.title = '';
      this.content = '';
      this.imageUrl = '';
    } catch (error) {
      console.error('Fehler beim Erstellen des Beitrags:', error);
      this.errorMessage = 'Fehler beim Erstellen des Beitrags.';
      this.uploadSuccessMessage = '';
    }
  }

 
}


