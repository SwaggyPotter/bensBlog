import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {
    const auth = getAuth();
    const user = auth.currentUser; // Prüft, ob ein Benutzer angemeldet ist

    if (user) {
      return true; // Zugriff erlauben
    } else {
      this.router.navigate(['/login']); // Zur Login-Seite weiterleiten
      return false; // Zugriff verweigern
    }
  }
}
