import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('src/app/landingpage/landingpage.module').then((m) => m.LandingpagePageModule),
  },
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

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
