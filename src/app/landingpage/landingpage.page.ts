import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.page.html',
  styleUrls: ['./landingpage.page.scss'],
})
export class LandingpagePage implements OnInit {
  // Statische Platzhalter-Daten
  latestPost = {
    title: 'Platzhalter-Titel',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.',
    image: 'assets/imgs/placeholder-image.jpg',
    date: new Date(2024, 11, 10), // 10. Dezember 2024
  };

  formattedDate: string = '';

  ngOnInit() {
    // Datum formatieren
    this.formattedDate = this.formatDate(this.latestPost.date);
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('de-DE', options); // Formatierung für Deutschland
  }
}



