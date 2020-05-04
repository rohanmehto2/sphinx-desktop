import { Component, OnInit, Injector } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm;
  loading = false;
  submitted = false;
  returnUrl: string;
  error: string;

  constructor(private formBuilder: FormBuilder, private router: Router, private injector: Injector) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  private authService = this.injector.get(AuthService);
  private configService = this.injector.get(ConfigService);

  ngOnInit() {

  }

  get f() { return this.loginForm.controls; }

  async onSubmit(credentials) {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }
    console.log(credentials);
    // this.loginForm.reset();
    this.loading = true;
    const success = await this.authService.login(credentials);
    if (!success) {
      this.loading = false;
      this.error = 'Invalid credentials';
      return;
    }
    await this.configService.setEmail(credentials.email);
    this.router.navigate(['/home']);
  }

}
