// ============================================
// FILE: client/src/components/common/SearchBar.jsx
// ============================================
import { useState } from 'react';
import '../../styles/SearchBar.css';

const SearchBar = ({ onSearch, placeholder = 'Search...' }) => {
  const [query, setQuery] = useState('');
  
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };
  
  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="search-input"
      />
      <span className="search-icon">🔍</span>
    </div>
  );
};

export default SearchBar;