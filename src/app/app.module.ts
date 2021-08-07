import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';

import { AppComponent } from './app.component';
import { MaterialModule } from './shared/ui/material.module';
import { AuthModule } from './auth/auth.module';
import { AuthDialogModule } from './shared/ui/auth-dialog/auth-dialog.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'paths',
    loadChildren: () => import('./paths/paths.module').then((m) => m.PathsModule),
  },
  {
    path: 'courses',
    loadChildren: () => import('./courses/courses.module').then((m) => m.CoursesModule),
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'questions',
    loadChildren: () => import('./questions/questions.module').then((m) => m.QuestionsModule),
  },
  {
    path: 'articles',
    loadChildren: () => import('./articles/articles.module').then((m) => m.ArticlesModule),
  },
  {
    path: 'labs',
    loadChildren: () => import('./labs/labs.module').then((m) => m.LabsModule),
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    AuthModule,
    ReactiveComponentModule,
    AuthDialogModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
