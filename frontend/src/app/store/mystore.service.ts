import { AuthService } from './../shared/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MystoreService {
  private url: string = "http://127.0.0.1:54321/functions/v1/pokemon/"
  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
  ) { }

  getAny() {
    console.log('Esto es un any');
  }

  async getPokemons(options: any):Promise<any> {
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
    console.log(params.toString())
    return this.httpClient
      .get(this.url, { headers, params })
      .toPromise();
  }
}
