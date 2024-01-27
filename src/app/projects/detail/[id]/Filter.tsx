import React from 'react';
import { Input, Avatar } from 'antd';
import { Member } from '@/lib/types';

interface FilterProps {
  members: Member[];
  onSearch: (query: string) => void; // Define onSearch callback function
}

const Filter: React.FC<FilterProps> = ({ members, onSearch }) => {
  const handleSearch = (value: string) => {
    onSearch(value); // Call the onSearch function with the search query
  };

  return (
    <div className="flex justify-between items-center mb-4 px-8">
      <div className="flex items-center">
        <Input.Search
          placeholder="Search issues"
          style={{ width: '300px' }}
          onSearch={handleSearch} // Call handleSearch on search action
        />
        <div className="ml-4">
          <Avatar.Group maxCount={5}>
            {members.map((member: Member) => (
              <Avatar key={member.userId} src={member.avatar} alt={member.name} size={40} />
            ))}
          </Avatar.Group>
        </div>
      </div>
    </div>
  );
};

export default Filter;
