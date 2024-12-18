import { environment } from './../../../environments/environment';
// import { AuthResponse } from './../../../../node_modules/@supabase/auth-js/src/lib/types';
import { Injectable } from '@angular/core';
import { createClient, Session, AuthResponse } from '@supabase/supabase-js';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabaseUrl = environment.supabaseUrl;
  private supabaseKey = environment.supabaseKey;
  private supabase = createClient(this.supabaseUrl, this.supabaseKey);
  constructor() {
    this.initializeAuthListener();
  }

  async getSession(): Promise<Session | null> {
    const { data } = await this.supabase.auth.getSession();
    return data?.session || null;
  }

  async refreshSession(): Promise<void> {
    const { error } = await this.supabase.auth.refreshSession();
    if (error) {
      console.error('Error al renovar la sesión:', error.message);
    }
  }

  async signIn(email: string, password: string):Promise<AuthResponse>{
    return this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async register(email: string, password: string, name: string):Promise<AuthResponse>{
    return this.supabase.auth.signUp({
      email,
      password,
      options:{
        data: {
          role: 'client',
          name: name
        }
      }
    });
  }

  async signOutUser(){
    return this.supabase.auth.signOut();
  }

  // Escuchar eventos de autenticación
  initializeAuthListener():void {
    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log('Evento de autenticación:', event);
      if (event === 'SIGNED_IN') {
        console.log('Usuario inició sesión:', session);
      } else if (event === 'SIGNED_OUT') {
        console.log('Usuario cerró sesión');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token renovado:', session?.access_token);
      }
    });
  }
}
