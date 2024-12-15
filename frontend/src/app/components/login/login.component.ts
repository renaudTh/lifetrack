import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { UserService } from '../../../domain/user.service';
import { Router } from '@angular/router';
import { FloatLabel } from 'primeng/floatlabel';
import { Message } from 'primeng/message';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, Button, InputText, FloatLabel, Message],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private readonly fb = inject(FormBuilder);
  protected loginForm: FormGroup;
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  error: string | null = null;
  async onSubmit() {
    this.error = null;
    try{
      const { username, password } = this.loginForm.value;
      await this.userService.login(username, password);
      this.router.navigate([""]);
    }
    catch(error: any){
      console.error(error);
      this.error = error.message;
    }
  }

  protected invalidUsername(): boolean | undefined{
    return this.loginForm.get('username')?.invalid && this.loginForm.get('username')?.touched
  }
  protected invalidPassword(): boolean | undefined{
    return this.loginForm.get('password')?.invalid && this.loginForm.get('password')?.touched
  }
}
