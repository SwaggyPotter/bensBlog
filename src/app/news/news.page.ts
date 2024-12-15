import { Component, OnInit } from '@angular/core';

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
  // Beiträge als Array von Post-Objekten
  posts: Post[] = [
    {
      title: 'Beitrag 1',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.',
      image: 'assets/imgs/placeholder-image.jpg',
      date: new Date(2024, 11, 10), // 10. Dezember 2024
    },
    {
      title: 'Beitrag 2',
      content:
        'Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Sed porttitor lectus nibh.',
      image: 'assets/imgs/placeholder-image.jpg',
      date: new Date(2024, 11, 9), // 9. Dezember 2024
    },
    {
      title: 'Beitrag 3',
      content:
        'Pellentesque in ipsum id orci porta dapibus. Vestibulum ac diam sit amet quam vehicula elementum.',
      image: 'assets/imgs/placeholder-image.jpg',
      date: new Date(2024, 11, 8), // 8. Dezember 2024
    },
  ];

  // Sortierte Beiträge
  sortedPosts: Post[] = [];

  ngOnInit() {
    // Beiträge nach Datum sortieren (neueste zuerst)
    this.sortedPosts = this.posts.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('de-DE', options);
  }
}


