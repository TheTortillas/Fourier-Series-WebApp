import { Routes } from '@angular/router';
import { CanvaComponent } from './pages/canva/canva.component';

export const routes: Routes = [
    {
        path: 'home',
        component: CanvaComponent
    },

    {
        path:'',
        redirectTo: 'home',
        pathMatch: 'full',
    },
];
