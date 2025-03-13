import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor() {}

  getMenuItems(role: string) {
    const menu = [
      { title: 'setting/user-manager', link: '/setting/user-manager', roles: ['ROLE_MANAGER'] },

    ];

    return menu.filter(item => item.roles.includes(role));
  }
}
