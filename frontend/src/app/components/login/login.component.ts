import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { UserProviderService } from '../../../providers/user.provider.service';
import { EMPTY, catchError, take } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CardModule, ButtonModule, PasswordModule, InputTextModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  protected login = "";
  protected password = "";

  constructor(private userService: UserProviderService, private router: Router){}

  get cantSubmit(): boolean{
    return (this.login==="" || this.password === "")
  }

  submit(){
    this.userService.login(this.login, this.password).pipe(take(1), catchError((err: any) => {console.info(err.message); return EMPTY})).subscribe((user) =>  this.router.navigate(["/"]))
   
  }

}
