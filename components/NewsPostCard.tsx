import React from 'react';
import { Route } from '../App';
import { NewsPost } from '../data/mockData';

interface NewsPostCardProps {
  post: NewsPost;
  onNavigate: (route: Route) => void;
}

const NewsPostCard: React.FC<NewsPostCardProps> = ({ post, onNavigate }) => {
  const { $id, title, author, date, category, excerpt, image } = post;
  return (
    <div 
  className="group relative w-full overflow-hidden rounded-[28px] border border-white/50 bg-white/70 backdrop-blur-2xl shadow-[0_28px_70px_-32px_rgba(15,23,42,0.7)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_90px_-35px_rgba(15,23,42,0.75)] cursor-pointer" 
      onClick={() => onNavigate({ page: 'news-post', id: $id })}
    >
      <div className="relative h-48 overflow-hidden">
        <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
      </div>
      <div className="relative p-6 flex flex-col flex-grow">
        <span className="text-accent-primary font-bold uppercase tracking-wide text-xs mb-2">{category}</span>
        <h3 className="font-unica-one text-2xl text-primary-text mb-3">{title}</h3>
        <p className="text-secondary-text/80 leading-relaxed flex-grow mb-5">{excerpt}</p>
        <div className="pt-4 border-t border-white/60 text-sm text-secondary-text/70 flex justify-between items-center">
            <span>By {author}</span>
            <span>{date}</span>
        </div>
      </div>
    </div>
  );
};

export default NewsPostCard;