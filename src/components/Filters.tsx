import { useCallback, useState } from 'react';

const Filter = () => {
  const [priceRange, setPriceRange] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  const updateActiveFilters = useCallback((price: string, size: string) => {
    let count = 0;
    if (price !== 'all') count++;
    if (size !== 'all') count++;
    setActiveFilters(count);
  }, []);

  // Create stable function references with useCallback
  const handleExpandToggle = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPriceRange(e.target.value);
      updateActiveFilters(e.target.value, selectedSize);
    },
    [selectedSize, updateActiveFilters]
  );

  const handleSizeSelect = useCallback(
    (size: string) => {
      const newSize = size.toLowerCase();
      setSelectedSize(newSize);
      updateActiveFilters(priceRange, newSize);
    },
    [priceRange, updateActiveFilters]
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortBy(e.target.value);
    },
    []
  );

  const handleClearAll = useCallback(() => {
    setPriceRange('all');
    setSelectedSize('all');
    setSortBy('featured');
    setActiveFilters(0);
  }, []);

  // Create handlers for arrow functions in JSX
  const handleAdvancedPriceSelect = useCallback(
    (value: string) => {
      setPriceRange(value);
      updateActiveFilters(value, selectedSize);
    },
    [selectedSize, updateActiveFilters]
  );

  const handleAdvancedSortSelect = useCallback((value: string) => {
    setSortBy(value);
  }, []);

  // Add these new handlers for the filter removal buttons
  const handlePriceFilterRemove = useCallback(() => {
    setPriceRange('all');
    updateActiveFilters('all', selectedSize);
  }, [selectedSize, updateActiveFilters]);

  const handleSizeFilterRemove = useCallback(() => {
    setSelectedSize('all');
    updateActiveFilters(priceRange, 'all');
  }, [priceRange, updateActiveFilters]);

  const priceOptions = [
    { value: 'all', label: 'All', icon: '💰' },
    { value: '0-50', label: '<$50', icon: '🏷️' },
    { value: '50-100', label: '$50-100', icon: '💵' },
    { value: '100-200', label: '$100-200', icon: '💸' },
    { value: '200+', label: '$200+', icon: '💎' },
  ];

  const sortOptions = [
    { value: 'featured', label: 'Featured', icon: '⭐' },
    { value: 'newest', label: 'Newest', icon: '🆕' },
    { value: 'price-low', label: 'Price ↑', icon: '📈' },
    { value: 'price-high', label: 'Price ↓', icon: '📉' },
    { value: 'popular', label: 'Popular', icon: '🔥' },
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-white via-orange-50/30 to-amber-50/20 p-0.5 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-black dark:text-white">
      <div className="rounded-2xl bg-white/95 p-4 backdrop-blur-sm">
        {/* Compact Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-amber-500">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-800">Filters</h2>
            {activeFilters > 0 && (
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                {activeFilters}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeFilters > 0 && (
              <button
                className="rounded-lg px-2 py-1 text-xs font-medium text-gray-600 transition-all hover:bg-gray-100"
                onClick={handleClearAll}
              >
                Clear
              </button>
            )}
            <button
              className="rounded-lg p-1.5 text-orange-500 transition-all hover:bg-orange-50"
              onClick={handleExpandToggle}
            >
              <svg
                className={`h-4 w-4 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Compact Quick Filters - Always Visible */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {/* Quick Price Filter */}
          <select
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:border-orange-300 focus:border-orange-500 focus:outline-none"
            value={priceRange}
            onChange={handlePriceChange}
          >
            {priceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>

          {/* Quick Size Filter */}
          <div className="flex gap-1">
            {sizes.map((size) => (
              <button
                className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                  selectedSize === size.toLowerCase()
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
                }`}
                key={size}
                onClick={() => handleSizeSelect(size)}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Quick Sort Filter */}
          <select
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:border-orange-300 focus:border-orange-500 focus:outline-none"
            value={sortBy}
            onChange={handleSortChange}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Expandable Advanced Filters */}
        <div
          className={`transition-all duration-500 ease-out ${
            isExpanded
              ? 'mt-4 max-h-96 opacity-100'
              : 'max-h-0 overflow-hidden opacity-0'
          }`}
        >
          <div className="space-y-4">
            {/* Advanced Price Range */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                💰 Price Range
              </label>
              <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
                {priceOptions.map((option) => (
                  <button
                    className={`rounded-lg border p-2 text-xs font-medium transition-all ${
                      priceRange === option.value
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'
                    }`}
                    key={option.value}
                    onClick={() => handleAdvancedPriceSelect(option.value)}
                  >
                    <div className="text-center">
                      <div className="text-sm">{option.icon}</div>
                      <div>{option.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Size Selection */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                📏 Size Guide
              </label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    className={`relative h-12 w-12 rounded-lg font-bold transition-all ${
                      selectedSize === size.toLowerCase()
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
                    }`}
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                  >
                    {size}
                    {selectedSize === size.toLowerCase() && (
                      <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-green-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Sort Options */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                🔄 Sort Options
              </label>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {sortOptions.map((option) => (
                  <button
                    className={`flex items-center gap-2 rounded-lg border p-2 text-xs font-medium transition-all ${
                      sortBy === option.value
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'
                    }`}
                    key={option.value}
                    onClick={() => handleAdvancedSortSelect(option.value)}
                  >
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Summary - Compact */}
        {(priceRange !== 'all' || selectedSize !== 'all') && (
          <div className="mt-3 flex flex-wrap gap-1">
            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                💰 {priceOptions.find((p) => p.value === priceRange)?.label}
                <button
                  className="ml-1 rounded-full hover:bg-orange-200"
                  onClick={handlePriceFilterRemove}
                >
                  <svg
                    className="h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      clipRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      fillRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            )}
            {selectedSize !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                📏 {selectedSize.toUpperCase()}
                <button
                  className="ml-1 rounded-full hover:bg-orange-200"
                  onClick={handleSizeFilterRemove}
                >
                  <svg
                    className="h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      clipRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      fillRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;
