import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../core/services/authentication.service';
import { AccessData } from '../shared/models/accessData';
import { Router } from '@angular/router';
interface login {
  usuario: string,
  password: string
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  submitted: boolean = false;
    loginForm: FormGroup = this.fb.group({
      usuario: ['', [ Validators.required ]],
      password: ['', [Validators.minLength(6), Validators.required]],
    });  
  constructor(private fb: FormBuilder, private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }
  login(): void{
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    let usuario: login;
    usuario = this.loginForm.value;
    this.authService
      .login(usuario)
      .subscribe((data: AccessData) => {
        this.router.navigateByUrl('/vendas')
      })
  }

}
