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
      className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300 cursor-pointer" 
      onClick={() => onNavigate({ page: 'news-post', id: $id })}
    >
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-accent-primary font-bold uppercase text-xs mb-2">{category}</span>
        <h3 className="font-unica-one text-2xl text-primary-text mb-3">{title}</h3>
        <p className="text-secondary-text leading-relaxed flex-grow mb-4">{excerpt}</p>
        <div className="pt-4 border-t border-soft-gray text-sm text-gray-500 flex justify-between items-center">
            <span>By {author}</span>
            <span>{date}</span>
        </div>
      </div>
    </div>
  );
};

export default NewsPostCard;