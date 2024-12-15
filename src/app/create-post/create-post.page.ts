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
  selectedFile: File | null = null; // Datei-Referenz
  uploadSuccessMessage: string = '';
  errorMessage: string = '';
  imageUrl: string = ''; // URL des hochgeladenen Bildes
  uploadProgress: number = 0; // Fortschrittsanzeige in Prozent
  isUploading: boolean = false; // Flag für den Upload-Status
  db = getFirestore();

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('Ausgewählte Datei:', this.selectedFile);
  }

  async createPost() {
    if (!this.selectedFile) {
      this.errorMessage = 'Bitte wähle ein Bild aus, bevor du einen Beitrag erstellst.';
      return;
    }

    try {
      // Upload-Status aktivieren
      this.isUploading = true;
      this.uploadProgress = 0;

      // Bild hochladen
      const storage = getStorage();
      const storageRef = ref(storage, `images/${this.selectedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, this.selectedFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Fortschritt berechnen
          this.uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        (error) => {
          console.error('Fehler beim Upload:', error);
          this.errorMessage = 'Fehler beim Hochladen des Bildes.';
          this.isUploading = false; // Upload-Status deaktivieren
        },
        async () => {
          // Nach erfolgreichem Upload Bild-URL abrufen
          this.imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('Bild erfolgreich hochgeladen:', this.imageUrl);

          // Beitrag speichern
          const postsCollection = collection(this.db, 'posts');
          await addDoc(postsCollection, {
            title: this.title,
            content: this.content,
            image: this.imageUrl,
            date: new Date().toISOString(),
          });

          // Erfolgsanzeige
          this.uploadSuccessMessage = 'Beitrag erfolgreich erstellt!';
          this.errorMessage = '';
          this.resetForm();
        }
      );
    } catch (error) {
      console.error('Fehler beim Erstellen des Beitrags:', error);
      this.errorMessage = 'Fehler beim Erstellen des Beitrags.';
      this.uploadSuccessMessage = '';
    } finally {
      this.isUploading = false; // Upload-Status deaktivieren
    }
  }

  resetForm() {
    this.title = '';
    this.content = '';
    this.selectedFile = null;
    this.imageUrl = '';
    this.uploadProgress = 0;
    this.isUploading = false;
  }
}



