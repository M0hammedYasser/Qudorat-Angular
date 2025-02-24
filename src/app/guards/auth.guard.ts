import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "../service/authentication/authentication.service";

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = sessionStorage.getItem('token');
  if (token) {
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};
