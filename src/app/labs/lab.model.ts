import { Article } from '../articles/article.model';

export type Lab = Omit<Article, 'articleId'> & {
  labId: string;
};
