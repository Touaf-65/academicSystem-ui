import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of, Subject } from 'rxjs';
import { API_CONFIG } from '../../../../core/constants/api.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userChanged$ = new Subject<void>();
  private jwtService = new JwtHelperService();

  constructor(private http:HttpClient, private router:Router) { }

  private getAuthHeaders(): HttpHeaders{
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('❌ Aucun token trouvé dans localStorage');
      throw new Error('Token d\'authentification manquant');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    console.log('📤 Headers envoyés:', headers.keys());
    return headers;
  }

  login(login:any){
    return this.http.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,login);
  }

  register(credentials: any) {
    return this.http.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, credentials);
  }

  setAccesToken(authenticationResponse:any):void{
    const token = authenticationResponse.token || authenticationResponse.access_token;
    if (token) {
      localStorage.setItem('authToken', token);
    }
  }
  setConnectedUser(utilisateur: any): void {
    localStorage.setItem('connectedUser', JSON.stringify(utilisateur));
    this.userChanged$.next();
  }

  getConnectedUser(): any {
    if (localStorage.getItem('connectedUser')) {
      return JSON.parse(localStorage.getItem('connectedUser') as string);
    }
    return {};
  }

  isTokenValid(){
    const token=localStorage.getItem("authToken");
    return token ? !this.jwtService.isTokenExpired(token) : false;
  }

  getConnectedUserByEmail(email?:string):Observable<any>{
    if(email!==undefined){
      return this.http.get(`${API_CONFIG.BASE_URL}/auth/getConnectedUserByEmail/${email}/`);
    }
    return of();
  }

  getConnectedUserByToken(): Observable<any> {
    const token = localStorage.getItem('authToken');

    const url = `${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.AUTH.PROFILE}`;


    return this.http.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.PROFILE}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }


  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('connectedUser');
    this.userChanged$.next();
    this.router.navigate(['/auth/sign-in']);
  }

  isLoggedIn(): boolean {
    if(this.getConnectedUser().email!=null){
      return true
    }
    return false;
  }


}
