import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { generations } from './generations';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
export function getGroupNamesUpToGeneration(generationId: number): string[] {
  const groupNames: string[] = [];
  
  // Iterar sobre las generaciones hasta el ID especificado
  for (let i = 0; i < generationId; i++) {
    const generation = generations[i];
    
    if (generation) {
      // Extraer nombres de grupos de la generación actual
      const names = generation.groups.map(group => group.groupName);
      groupNames.push(...names); // Añadir los nombres al array
    }
  }
  
  return groupNames;
}
console.log(getGroupNamesUpToGeneration(2));
