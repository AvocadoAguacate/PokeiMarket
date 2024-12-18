import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MystoreService {
  private url: string = environment.storeUrl;

  private pokemonsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public pokemons$: Observable<any[]> = this.pokemonsSubject.asObservable();
  private pokemonSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public pokemon$: Observable<any[]> = this.pokemonSubject.asObservable();
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

  async fetchPokemon(options: any): Promise<void> {
    try {
      const session = await this.authService.getSession();
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${session?.access_token}`,
      });
      console.log(options);
      const queryParams: { [key: string]: any } = { generation: options.generation };
      let params = new HttpParams();
      for (const key in queryParams) {
        if (queryParams.hasOwnProperty(key)) {
          params = params.append(key, queryParams[key]);
        }
      }
      console.log('Fetching pokemon with params:');
      console.log( params.toString())
      this.httpClient
        .get<any[]>(`${this.url}/${options.id}`, { headers, params })
        .subscribe((response) => {
          console.log(response)
          this.pokemonSubject.next(response); // Actualiza el BehaviorSubject
        }, (error) => {
          console.error('Error fetching pokemons:', error);
        });
    } catch (error) {
      console.error('Error in fetchPokemons:', error);
    }
  }

  getPokemon(): Observable<any[]> {
    return this.pokemon$; 
  }
  
}
