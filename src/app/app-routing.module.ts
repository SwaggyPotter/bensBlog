import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; // Import the AuthGuard

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
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'create-post',
    loadChildren: () => import('./create-post/create-post.module').then((m) => m.CreatePostPageModule),
    canActivate: [AuthGuard], // Apply the AuthGuard to protect this route
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }

