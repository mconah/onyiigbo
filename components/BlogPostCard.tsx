import React from 'react';
import { Route } from '../App';
import { Post } from '../data/mockData'; // Import Post interface from mockData

interface BlogPostCardProps {
  post: Post;
  onNavigate: (route: Route) => void;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, onNavigate }) => {
  const { $id, title, author, date, category, excerpt } = post;
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300 cursor-pointer" onClick={() => onNavigate({ page: 'blog-post', id: $id })}>
      <img src={`https://picsum.photos/seed/${$id}/600/400`} alt={title} className="w-full h-48 object-cover" />
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

export default BlogPostCard;