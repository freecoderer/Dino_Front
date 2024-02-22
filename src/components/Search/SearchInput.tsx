import React, { useState } from 'react';
import search from '@assets/Search/search.svg';
import { useNavigate } from 'react-router-dom';

const SearchInput: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(`?query=${searchQuery}`);
  };

  return (
    <form onSubmit={handleSubmit} >
      <div className="w-full mb-4 flex flex-col items-center relative focus:border-slate-300 ">
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          placeholder="사용자 혹은 플레이리스트를 검색해보세요!"
          className="w-[360px] h-[50px] bg-[#D9D9D9] bg-opacity-20 rounded-lg pl-5 placeholder:text-sm"
        />
        <img onClick={handleSubmit} src={search} alt="이미지 설명" className="absolute right-6 top-4 cursor-pointer" />
      </div>
    </form>
  );
};

export default SearchInput;