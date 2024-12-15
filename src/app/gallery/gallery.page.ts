import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
  // Beispiel-Posts mit Bildern
  posts = [
    {
      title: 'Beitrag 1',
      image: 'assets/imgs/placeholder-image.jpg',
    },
    {
      title: 'Beitrag 2',
      image: 'assets/imgs/placeholder-image.jpg',
    },
    {
      title: 'Beitrag 3',
      image: 'assets/imgs/placeholder-image.jpg',
    },
  ];

  ngOnInit() {
    // Hier könnten später Daten dynamisch geladen werden
  }
}

