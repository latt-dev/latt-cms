import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArticlesComponent } from './articles.component';
import { MaterialModule } from '../shared/ui/material.module';
import { LoadingModule } from '../shared/ui/loading/loading.module';
import { ConfirmDeletionDialogModule } from '../shared/ui/confirm-deletion-dialog/confirm-deletion-dialog.module';

const routes: Routes = [
  {
    path: '',
    component: ArticlesComponent,
    data: { title: 'Articles' },
  },
  {
    path: 'new',
    loadChildren: () => import('./article/article.module').then((m) => m.ArticleModule),
    data: { pageType: 'Create', title: 'Create Article' },
  },
  {
    path: ':articleId',
    loadChildren: () => import('./article/article.module').then((m) => m.ArticleModule),
    data: { pageType: 'Edit', title: 'Edit Article' },
  },
];

@NgModule({
  declarations: [ArticlesComponent],
  imports: [CommonModule, RouterModule.forChild(routes), MaterialModule, LoadingModule, ConfirmDeletionDialogModule],
})
export class ArticlesModule {}
