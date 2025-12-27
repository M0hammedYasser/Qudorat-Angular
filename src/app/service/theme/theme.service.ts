import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private darkMode = new BehaviorSubject<boolean>(false);
    isDarkMode$ = this.darkMode.asObservable();

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformBrowser(this.platformId)) {
            this.loadTheme();
        }
    }

    toggleTheme() {
        if (isPlatformBrowser(this.platformId)) {
            this.darkMode.next(!this.darkMode.value);
            this.updateBodyClass();
            this.saveTheme();
        }
    }

    setTheme(isDark: boolean) {
        this.darkMode.next(isDark);
        this.updateBodyClass();
        this.saveTheme();
    }

    private updateBodyClass() {
        if (this.darkMode.value) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    private saveTheme() {
        localStorage.setItem('theme', this.darkMode.value ? 'dark' : 'light');
    }

    private loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.darkMode.next(savedTheme === 'dark');
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.darkMode.next(prefersDark);
        }
        this.updateBodyClass();
    }

    isDark(): boolean {
        return this.darkMode.value;
    }
}
