import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MystoreService {
  private url: string = "http://127.0.0.1:54321/functions/v1/pokemon/"

  private pokemonsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public pokemons$: Observable<any[]> = this.pokemonsSubject.asObservable();
  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
  ) { }

  getAny() {
    console.log('Esto es un any');
  }

  async fetchPokemons(options: any): Promise<void> {
    try {
      const session = await this.authService.getSession();
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${session?.access_token}`,
      });
      console.log(options);
      const queryParams = options || { generation: 1 };
      let params = new HttpParams();
      for (const key in queryParams) {
        if (queryParams.hasOwnProperty(key)) {
          params = params.append(key, queryParams[key]);
        }
      }

      console.log('Fetching pokemons with params:');
      console.log( params.toString())
      this.httpClient
        .get<any[]>(this.url, { headers, params })
        .subscribe((response) => {
          console.log(response)
          this.pokemonsSubject.next(response); // Actualiza el BehaviorSubject
        }, (error) => {
          console.error('Error fetching pokemons:', error);
        });
    } catch (error) {
      console.error('Error in fetchPokemons:', error);
    }
  }

  getPokemons(): Observable<any[]> {
    return this.pokemons$; 
  }
}
