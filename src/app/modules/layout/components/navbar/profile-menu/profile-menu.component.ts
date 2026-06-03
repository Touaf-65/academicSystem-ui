import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ThemeService } from '../../../../../core/services/theme.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive';
import { SvgIconComponent } from 'angular-svg-icon';
import { Action } from 'rxjs/internal/scheduler/Action';
import { UserService } from '../../../../authentication/services/user/user.service';
import { NotificationService } from '../../../../../shared/components/notification/notification.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ClickOutsideDirective, SvgIconComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          transform: 'translateY(0)',
          visibility: 'visible',
        }),
      ),
      state(
        'closed',
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
          visibility: 'hidden',
        }),
      ),
      transition('open => closed', [animate('0.2s')]),
      transition('closed => open', [animate('0.2s')]),
    ]),
  ],
})
export class ProfileMenuComponent implements OnInit {
  public isOpen = false;
  public isDarkMode = false;
  public currentUser: any = null;
  public profileMenu = [
    {
      title: 'Profile',
      icon: '/assets/icons/heroicons/outline/user-circle.svg',
      link: 'dashboard/profile',
      action: null,
    },
    {
      title: 'Log out',
      icon: '/assets/icons/heroicons/outline/logout.svg',
      link: 'null',
      action: 'logout',
    },
  ];
  public themeColors = [
    {
      name: 'base',
      code: '#e11d48',
    },

    {
      name: 'red',
      code: '#cc0022',
    },
    {
      name: 'blue',
      code: '#007bff',
    },

    {
      name: 'green',
      code: '#28a745',
    },
  ];
  public themeMode = ['light', 'dark'];

  constructor(
    public themeService: ThemeService,
    public userService: UserService,
    public notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getConnectedUser();
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  handleMenuAction(action: string | null, link: string | null) {
    if (action === 'logout') {
      this.logout();
    } else if (link) {
      // Navigation normale pour les autres liens
      window.location.href = link;
    }
  }

  logout() {
    this.notificationService.success('Déconnexion réussie', 'Vous êtes maintenant déconnecté');

    // Attendre 1 seconde avant de déconnecter pour laisser le temps à la notification d'apparaître
    timer(1000).subscribe(() => {
      this.userService.logout();
    });
  }

  toggleThemeMode() {
    this.themeService.theme.update((theme) => {
      const mode = !this.themeService.isDark ? 'dark' : 'light';
      return { ...theme, mode: mode };
    });
  }
  toggleThemeColor(color: string) {
    this.themeService.theme.update((theme) => {
      return { ...theme, color: color };
    });
  }
}
