# Backend
We chose Supabase for hosting our API and database due to its integration with Deno, which allows us to start from a more advanced point in development. Additionally, Supabase provides a PostgreSQL database known for its reliability and powerful features, essential for our data management needs. Being an open-source platform, it also offers transparency and flexibility for customization. Moreover, Supabase's development tools enable easy local deployment, streamlining our workflow for efficient application development and testing.

## Local
### Install
```bash
npm install
```
### Run 
```bash
npx supabase start
```
### Stop
```bash
npx supabase stop
```
### Edge Functions
#### Hot-reloading 
```bash
supabase functions serve --env-file ./supabase/.env.local
```
#### Create a newone
```bash
npx supabase functions new hello-world
```
### DB
#### Reload
```bash
npx supabase db reset 
```