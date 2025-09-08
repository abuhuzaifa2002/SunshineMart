'use client';

import {use,useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { products } from '../data/products';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const [categoryResults, setCategoryResults] = useState<typeof categories>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDark, setIsDark] = useState(false);
  type User = { name: string } | null;
  const [user, setUser] = useState<User>(null);
  
  
  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, [])

 

  // Create stable function reference with useCallback
  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  const handleCategoriesToggle = useCallback(() => {
    setIsCategoriesOpen(!isCategoriesOpen);
  }, [isCategoriesOpen]);

  const handleCategoriesClose = useCallback(() => {
    setIsCategoriesOpen(false);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setCategoryResults([]);
    setSelectedIndex(-1);
    setIsSearchVisible(false);
  }, []);

  // Category data with images - wrapped in useMemo for stability
  const categories = useMemo(
    () => [
      {
        id: 1,
        name: 'Summer Dresses',
        image:
          'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=300&h=200',
        href: '/collections/summer-dresses',
        description: 'Light & breezy styles',
      },
      {
        id: 2,
        name: 'Evening Gowns',
        image:
          'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=300&h=200',
        href: '/collections/evening-gowns',
        description: 'Elegant formal wear',
      },
      {
        id: 3,
        name: 'Casual Wear',
        image:
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=300&h=200',
        href: '/collections/casual-wear',
        description: 'Everyday comfort',
      },
      {
        id: 4,
        name: 'Accessories',
        image:
          'https://images.unsplash.com/photo-1506629905607-d405b7a82b8b?auto=format&fit=crop&w=300&h=200',
        href: '/collections/accessories',
        description: 'Complete your look',
      },
      {
        id: 5,
        name: 'Shoes',
        image:
          'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&h=200',
        href: '/collections/shoes',
        description: 'Step in style',
      },
      {
        id: 6,
        name: 'Bags',
        image:
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&h=200',
        href: '/collections/bags',
        description: 'Carry with confidence',
      },
    ],
    []
  );

  // Fix the handleSearchChange useCallback with proper dependencies
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      setSelectedIndex(-1);

      if (query.trim().length > 0) {
        // Filter products
        const filteredProducts = products.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredProducts.slice(0, 4));

        // Filter categories
        const filteredCategories = categories.filter(
          (category) =>
            category.name.toLowerCase().includes(query.toLowerCase()) ||
            category.description.toLowerCase().includes(query.toLowerCase())
        );
        setCategoryResults(filteredCategories.slice(0, 6));

        setTimeout(() => setIsSearchVisible(true), 50);
      } else {
        setIsSearchVisible(false);
        setTimeout(() => {
          setSearchResults([]);
          setCategoryResults([]);
        }, 200);
      }
    },
    [categories]
  );

  // Add the handleViewAllResults function
  const handleViewAllResults = useCallback(() => {
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  }, [searchQuery]);

  const totalResults = searchResults.length + categoryResults.length;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < totalResults - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (selectedIndex < categoryResults.length) {
            // Navigate to category
            window.location.href = categoryResults[selectedIndex].href;
          } else {
            // Navigate to product
            const productIndex = selectedIndex - categoryResults.length;
            window.location.href = `/product/${searchResults[productIndex].id}`;
          }
        } else if (searchQuery.trim()) {
          handleViewAllResults();
        }
      } else if (e.key === 'Escape') {
        inputRef.current?.blur();
        setIsSearchFocused(false);
        setIsSearchVisible(false);
      }
    },
    [
      searchResults,
      categoryResults,
      selectedIndex,
      searchQuery,
      totalResults,
      handleViewAllResults,
    ]
  );

  const handleResultClick = useCallback((productId: number) => {
    window.location.href = `/product/${productId}`;
  }, []);

  const handleCategoryClick = useCallback((href: string) => {
    window.location.href = href;
  }, []);

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
    if (searchQuery.trim() && totalResults > 0) {
      setIsSearchVisible(true);
    }
  }, [searchQuery, totalResults]);

  const handleSearchBlur = useCallback(() => {
    // Delay to allow click on results
    setTimeout(() => {
      setIsSearchFocused(false);
      setIsSearchVisible(false);
      setSelectedIndex(-1);
    }, 200);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
        setIsSearchVisible(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

    useEffect(() => {
    const userdata=localStorage.getItem('userData');
    const user = userdata ? JSON.parse(userdata) : null;
    console.log(user)
    setUser(user);

  }, []);

    useEffect(() => {
    const root = document.documentElement;
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = storedTheme === 'dark' || (!storedTheme && prefersDark);
    setIsDark(initialTheme);
    root.classList.toggle('dark', initialTheme);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const newTheme = !isDark;
    setIsDark(newTheme);
    root.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-amber-100/20 bg-white/50 shadow-lg backdrop-blur-md transition-all duration-500 dark:bg-black dark:text-white">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link className="group flex items-center" href="/">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-500  transition-all duration-500 ease-out group-hover:rotate-3 group-hover:scale-110 group-hover:shadow-lg">
              <span className="text-xl font-bold text-white transition-transform duration-300 group-hover:scale-110">
                ☀️
              </span>
            </div>
            <span className="gradient-text font-display text-orange-600 text-2xl font-bold transition-all duration-500 ease-out group-hover:scale-105 group-hover:tracking-wide">
              Sunshine
            </span>
          </Link>

          {/* Center Search Bar - Always Visible */}
          <div className="relative mx-8 max-w-2xl flex-1" ref={searchRef}>
            <div className="relative">
              <input
                className={`w-full rounded-2xl border bg-white px-6 py-3 pl-12 pr-12 text-sm transition-all duration-500 ease-out ${
                  isSearchFocused
                    ? 'scale-[1.02] border-orange-500 bg-orange-50/30 shadow-2xl ring-4 ring-orange-500/20'
                    : 'border-gray-200 hover:scale-[1.01] hover:border-gray-300 hover:shadow-md'
                } focus:outline-none`}
                placeholder="Search for products, categories, and more..."
                ref={inputRef}
                type="text"
                value={searchQuery}
                onBlur={handleSearchBlur}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onKeyDown={handleKeyDown}
              />
              <svg
                className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-all duration-300 ${
                  isSearchFocused
                    ? 'scale-110 text-orange-500'
                    : 'text-gray-400'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              {searchQuery ? (
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-300 hover:rotate-90 hover:scale-110 hover:text-gray-600"
                  onClick={handleClearSearch}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </button>
              ) : null}
            </div>

            {/* Enhanced Search Results Dropdown with Grid Categories */}
            <div
              className={`absolute left-0 right-0 top-full z-50 mt-2 transform overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-all duration-500 ease-out ${
                (isSearchFocused || isSearchVisible) && totalResults > 0
                  ? 'visible translate-y-0 scale-100 opacity-100'
                  : 'pointer-events-none invisible -translate-y-4 scale-95 opacity-0'
              }`}
            >
              <div className="p-4">
                {/* Categories Section - Grid Layout */}
                {categoryResults.length > 0 && (
                  <div className="mb-6">
                    <div
                      className={`mb-3 px-2 py-1 text-xs  font-medium uppercase tracking-wide text-gray-500 transition-all duration-700 ease-out ${
                        isSearchVisible
                          ? 'translate-x-0 opacity-100'
                          : '-translate-x-4 opacity-0'
                      }`}
                      style={{ transitionDelay: '100ms' }}
                    >
                      Categories ({categoryResults.length})
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {categoryResults.map((category, index) => {
                        const isSelected = index === selectedIndex;
                        return (
                          <button
                            className={`group relative transform overflow-hidden rounded-xl transition-all duration-500 ease-out ${
                              isSelected
                                ? 'scale-[1.05] shadow-lg ring-2 ring-orange-500'
                                : 'hover:scale-[1.03] hover:shadow-md'
                            } ${
                              isSearchVisible
                                ? 'translate-y-0 rotate-0 opacity-100'
                                : 'translate-y-8 rotate-3 opacity-0'
                            }`}
                            key={category.id}
                            style={{
                              transitionDelay: `${200 + index * 100}ms`,
                            }}
                            onClick={() => handleCategoryClick(category.href)}
                          >
                            <div className="relative h-20 w-full overflow-hidden">
                              <Image
                                fill
                                alt={category.name}
                                className="object-cover transition-all duration-500 ease-out group-hover:scale-110"
                                sizes="150px"
                                src={category.image}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                              <div
                                className={`absolute inset-0 transition-all duration-300 ${
                                  isSelected
                                    ? 'bg-orange-500/30'
                                    : 'bg-black/0 group-hover:bg-orange-500/20'
                                }`}
                              />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-2 text-left">
                              <div className="text-xs font-medium text-white drop-shadow-lg">
                                {category.name}
                              </div>
                              <div className="text-[10px] text-white/80 drop-shadow">
                                {category.description}
                              </div>
                            </div>
                            {isSelected ? (
                              <div className="absolute right-1 top-1">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white">
                                  <svg
                                    className="h-3 w-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      clipRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </div>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Products Section */}
                {searchResults.length > 0 && (
                  <div>
                    <div
                      className={`mb-3 px-2 py-1 text-xs font-medium uppercase tracking-wide text-gray-500 transition-all duration-700 ease-out ${
                        isSearchVisible
                          ? 'translate-x-0 opacity-100'
                          : 'translate-x-4 opacity-0'
                      }`}
                      style={{
                        transitionDelay: `${categoryResults.length * 100 + 200}ms`,
                      }}
                    >
                      Products ({searchResults.length})
                    </div>
                    <div className="space-y-2">
                      {searchResults.map((product, index) => {
                        const adjustedIndex = index + categoryResults.length;
                        const isSelected = adjustedIndex === selectedIndex;
                        return (
                          <button
                            className={`group w-full transform rounded-xl p-3 text-left transition-all duration-500 ease-out ${
                              isSelected
                                ? 'scale-[1.02] border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-900 shadow-md'
                                : 'hover:scale-[1.01] hover:bg-gray-50 hover:shadow-sm'
                            } ${
                              isSearchVisible
                                ? 'translate-x-0 rotate-0 opacity-100'
                                : 'translate-x-8 rotate-1 opacity-0'
                            }`}
                            key={product.id}
                            style={{
                              transitionDelay: `${(categoryResults.length + index) * 100 + 400}ms`,
                            }}
                            onClick={() => handleResultClick(product.id)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                                <Image
                                  fill
                                  alt={product.name}
                                  className="object-cover transition-all duration-500 ease-out group-hover:scale-110"
                                  sizes="48px"
                                  src={product.image}
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-semibold text-orange-600">
                                    ${product.price}
                                  </span>
                                  {product.originalPrice > product.price && (
                                    <span className="text-xs text-gray-500 line-through">
                                      ${product.originalPrice}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <svg
                                className={`h-4 w-4 transition-all duration-300 ${
                                  isSelected
                                    ? 'translate-x-1 scale-110 text-orange-500'
                                    : 'text-gray-400 group-hover:translate-x-1'
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M9 5l7 7-7 7"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                />
                              </svg>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              {searchQuery.trim() && (
                <div
                  className={`border-t border-gray-100 p-4 transition-all duration-700 ease-out ${
                    isSearchVisible
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-4 opacity-0'
                  }`}
                  style={{ transitionDelay: `${totalResults * 100 + 400}ms` }}
                >
                  <button
                    className="group flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-3 text-sm font-medium text-orange-600 transition-all duration-500 ease-out hover:scale-[1.02] hover:from-orange-100 hover:to-amber-100 hover:shadow-lg"
                    onClick={handleViewAllResults}
                  >
                    View all results for &quot;{searchQuery}&quot;
                    <svg
                      className="ml-2 h-4 w-4 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 5l7 7-7 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Enhanced No Results Animation */}
            <div
              className={`absolute left-0 right-0 top-full z-50 mt-2 transform overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-all duration-500 ease-out ${
                (isSearchFocused || searchQuery.trim()) &&
                searchQuery.trim() &&
                totalResults === 0
                  ? 'visible translate-y-0 scale-100 opacity-100'
                  : 'pointer-events-none invisible -translate-y-4 scale-95 opacity-0'
              }`}
            >
              <div className="p-8 text-center">
                <div className="relative">
                  <svg
                    className="mx-auto h-16 w-16 animate-pulse text-gray-400 transition-all duration-1000 ease-out"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  <div className="absolute inset-0 animate-ping rounded-full bg-gray-100 opacity-20" />
                </div>
                <h3
                  className="animate-in fade-in-0 slide-in-from-bottom-2 mt-4 text-lg font-medium text-gray-900 transition-all duration-700 ease-out"
                  style={{ animationDelay: '200ms', animationFillMode: 'both' }}
                >
                  No results found
                </h3>
                <p
                  className="animate-in fade-in-0 slide-in-from-bottom-2 mt-2 text-sm text-gray-500 transition-all duration-700 ease-out"
                  style={{ animationDelay: '400ms', animationFillMode: 'both' }}
                >
                  Try searching with different keywords or check your spelling.
                </p>
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Navigation Links - Moved to right */}
            <nav className="hidden items-center space-x-6 lg:flex">
              <Link
                className="nav-link text-gray-700 transition-all duration-300 hover:scale-105"
                href="/"
              >
                Home
              </Link>
              <div
                className="group relative"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCategoriesToggle();
                  }
                }}
                onMouseEnter={handleCategoriesToggle}
                onMouseLeave={handleCategoriesClose}
              >
                <button className="nav-link flex text-gray-700 items-center transition-all duration-300 hover:scale-105">
                  Categories
                  <svg
                    className={`ml-1 h-4 w-4 transition-all duration-500 ease-out ${
                      isCategoriesOpen
                        ? 'rotate-180 scale-110 text-orange-600'
                        : 'scale-100 text-gray-600'
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

                {/* Large Dropdown Menu with Enhanced Smooth Animations */}
                <div
                  className={`absolute right-0 top-full z-50 mt-2 w-[600px] transform transition-all duration-500 ease-out ${
                    isCategoriesOpen
                      ? 'visible translate-y-0 scale-100 opacity-100'
                      : 'pointer-events-none invisible -translate-y-8 scale-95 opacity-0'
                  }`}
                >
                  <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
                    {/* Header with enhanced slide-in animation */}
                    <div
                      className={`p-6 pb-4 transition-all duration-700 ease-out ${
                        isCategoriesOpen
                          ? 'translate-y-0 opacity-100'
                          : '-translate-y-8 opacity-0'
                      }`}
                      style={{ transitionDelay: '100ms' }}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 transition-all duration-300">
                        Shop by Category
                      </h3>
                      <p className="text-sm text-gray-500 transition-all duration-300">
                        Discover our curated collections
                      </p>
                    </div>

                    {/* Categories Grid with enhanced staggered animations */}
                    <div className="grid grid-cols-3 gap-4 px-6">
                      {categories.map((category, index) => (
                        <Link
                          className={`group block overflow-hidden rounded-xl bg-gray-50 transition-all duration-700 ease-out hover:-translate-y-2 hover:scale-105 hover:bg-gray-100 hover:shadow-xl ${
                            isCategoriesOpen
                              ? 'translate-y-0 rotate-0 opacity-100'
                              : 'translate-y-12 rotate-3 opacity-0'
                          }`}
                          href={category.href}
                          key={category.id}
                          style={{ transitionDelay: `${200 + index * 150}ms` }}
                          onClick={handleCategoriesClose}
                        >
                          <div className="relative h-32 w-full overflow-hidden">
                            <Image
                              fill
                              alt={category.name}
                              className="object-cover transition-all duration-700 ease-out group-hover:rotate-2 group-hover:scale-125 group-hover:brightness-110"
                              sizes="(max-width: 768px) 100vw, 200px"
                              src={category.image}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent transition-all duration-500 group-hover:from-black/20" />
                            <div className="absolute inset-0 bg-orange-500/0 transition-all duration-500 group-hover:bg-orange-500/20" />
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium text-gray-900 transition-all duration-500 group-hover:scale-105 group-hover:text-orange-600">
                              {category.name}
                            </h4>
                            <p className="text-xs text-gray-500 transition-all duration-500 group-hover:text-gray-600">
                              {category.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Footer with enhanced slide-in animation */}
                    <div
                      className={`border-t border-gray-100 p-6 pt-4 transition-all duration-700 ease-out ${
                        isCategoriesOpen
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-8 opacity-0'
                      }`}
                      style={{ transitionDelay: '1000ms' }}
                    >
                      <Link
                        className="group inline-flex items-center text-sm font-medium text-orange-600 transition-all duration-500 hover:translate-x-2 hover:scale-105 hover:text-orange-700"
                        href="/collections"
                        onClick={handleCategoriesClose}
                      >
                        View All Collections
                        <svg
                          className="ml-1 h-4 w-4 transition-all duration-500 group-hover:translate-x-2 group-hover:scale-110"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M9 5l7 7-7 7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <Link
                className="nav-link text-gray-700 transition-all duration-300 hover:scale-105"
                href="/new-arrivals"
              >
                New Arrivals
              </Link>
              <Link
                className="nav-link text-gray-700 relative transition-all duration-300 hover:scale-105"
                href="/sale"
              >
                Sale
                <span className="absolute text-gray-500 -right-1 -top-1 animate-pulse rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white transition-all duration-300 hover:animate-bounce">
                  Hot
                </span>
              </Link>
            </nav>



            {/* Cart */}
            <Link
              className="group relative rounded-xl p-2 transition-all duration-500 hover:-rotate-3 hover:scale-110 hover:bg-orange-50"
              href="/cart"
            >
              <svg
                className="h-5 w-5 text-gray-600 transition-all duration-300 group-hover:scale-110 group-hover:text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <span className="absolute -right-1 -top-1 flex h-5 w-5 animate-bounce items-center justify-center rounded-full bg-orange-500 text-xs text-white transition-all duration-500 group-hover:scale-125 group-hover:animate-pulse">
                3
              </span>
            </Link>

            {/* Mobile menu button */}
            <button
              className="rounded-xl p-2 transition-all duration-500 hover:rotate-12 hover:scale-110 hover:bg-orange-50 lg:hidden"
              onClick={handleMenuToggle}
            >
              <svg
                className="h-6 w-6 text-gray-600 transition-all duration-300 hover:text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="px-3 py-2 text-sm font-medium  text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-full transition-all duration-300"
            >
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button>
              <Link href="/admin/login" className='text-gray-700'>
                Admin
              </Link>
            </button>
             {/* User Account */}
              <Link
              href="/dashboard"
              className="flex items-center text-gray-700 hover:text-orange-600 font-medium group px-4 py-2 hover:bg-orange-50 rounded-full transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="ml-2 text-sm text-gray-700 uppercase tracking-wider">user</span>
            </Link>
            

          </div>
        </div>
      </div>
    </header>
  );
}







