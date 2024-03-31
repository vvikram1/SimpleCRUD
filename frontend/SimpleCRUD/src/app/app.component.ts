import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [HttpClientModule]
})
export class AppComponent {
  constructor(private http: HttpClient) {}

  submitForm(): void {
    const formData = {
      name: (document.getElementById('name') as HTMLInputElement).value,
      phone: (document.getElementById('phone') as HTMLInputElement).value,
      email: (document.getElementById('email') as HTMLInputElement).value
    };

    this.http.post('http://128.199.205.140:3000/users', formData)
      .subscribe(response => {
        console.log('API Response:', response);
        // Reset form after successful submission
        (document.getElementById('name') as HTMLInputElement).value = '';
        (document.getElementById('phone') as HTMLInputElement).value = '';
        (document.getElementById('email') as HTMLInputElement).value = '';
      }, error => {
        console.error('API Error:', error);
      });
  }
}
