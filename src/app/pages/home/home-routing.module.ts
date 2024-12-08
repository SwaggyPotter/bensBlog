import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'news',
        loadChildren: () =>
          import('src/app/news/news.module').then((m) => m.NewsPageModule),
      },
      {
        path: 'gallery',
        loadChildren: () =>
          import('src/app/gallery/gallery.module').then((m) => m.GalleryPageModule),
      },
      {
        path: '',
        redirectTo: 'news',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule { }
