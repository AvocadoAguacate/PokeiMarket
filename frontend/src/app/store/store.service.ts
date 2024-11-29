import { AuthService } from './../shared/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private url: string = "http://127.0.0.1:54321/functions/v1/pokemon/"
  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
  ) {
    this.getPokemons(null)
  }

  getAny(){
    console.log('Esto es un any')
  }


  async getPokemons(options: any):Promise<any> {
    console.log("getPokemons function called with options:", options); 
    const session = await this.authService.getSession()
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${session?.access_token}`,
    });
    const queryParams = options || { generation: 1 };
    let params = new HttpParams();
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        params = params.append(key, queryParams[key]);
      }
    }
    return this.httpClient
      .get(this.url, { headers, params })
      .toPromise();
  }
}
