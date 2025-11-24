import React from 'react';
import { Article } from '../types';
import { ArrowRight, Calendar, User } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onClick: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  return (
    <div 
      className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-700 flex flex-col h-full cursor-pointer"
      onClick={() => onClick(article)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-teal-700 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
            {article.category}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          {article.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3 flex-grow">
          {article.excerpt}
        </p>
        
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(article.date).toLocaleDateString('nl-NL')}
            </span>
            <span className="hidden sm:flex items-center">
              <User className="w-4 h-4 mr-1" />
              {article.author}
            </span>
          </div>
          <span className="text-teal-600 dark:text-teal-400 font-medium flex items-center group-hover:translate-x-1 transition-transform">
            Lees meer <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </div>
      </div>
    </div>
  );
};