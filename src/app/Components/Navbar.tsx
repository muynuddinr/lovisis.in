"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { debounce } from "lodash";
import Link from "next/link";
import { MapPin } from "lucide-react";
import Image from "next/image";

// Import logos
import logo from "../../../public/navbarlogo/lovosis-logo.png";
import iso from "../../../public/navbarlogo/iso.png";
import ce from "../../../public/navbarlogo/CE.png";
import si from "../../../public/navbarlogo/SI.png";
import sk from "../../../public/navbarlogo/SK.png";
import zed from "../../../public/navbarlogo/zed.png";
import gmp from "../../../public/navbarlogo/gmp.png";

// Types
interface Product {
  id: string;
  name: string;
  slug: string;
}

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  products: Product[];
  subCategories?: SubCategory[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  subCategories: SubCategory[];
}

interface NavbarCategory {
  id: string;
  name: string;
  slug: string;
  categories: Category[];
}

// Constants
const MAIN_NAV_ITEMS = [
  { name: "Home", href: "/", hasDropdown: false },
  { name: "About", href: "/about", hasDropdown: false },
  { name: "Services", href: "/services", hasDropdown: false },
  { name: "Products", href: "/products", hasDropdown: true },
  { name: "Certificates", href: "/certificates", hasDropdown: false },
  { name: "Gallery", href: "/gallery", hasDropdown: false },
];

const SCROLL_THRESHOLD = 50;
const SEARCH_DEBOUNCE_DELAY = 300;
const HOVER_DELAY = 300;

// Custom hooks
const useScrollDetection = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > SCROLL_THRESHOLD);

      if (Math.abs(currentScrollY - scrollPosition) > 5) {
        setScrollPosition(currentScrollY);
      }
    };

    const throttledScroll = () => {
      if (!scrollTimer) {
        scrollTimer = setTimeout(() => {
          handleScroll();
          scrollTimer = null as any;
        }, 150);
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [scrollPosition]);

  return { isScrolled, scrollPosition };
};

const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.trim().length === 0) {
          setSearchResults([]);
          setIsSearching(false);
          return;
        }

        setIsSearching(true);
        try {
          const response = await fetch(
            `/api/search?q=${encodeURIComponent(query)}`
          );
          const data = await response.json();
          setSearchResults(data);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, SEARCH_DEBOUNCE_DELAY),
    []
  );

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      debouncedSearch(query);
    },
    [debouncedSearch]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
  }, []);

  return { searchQuery, searchResults, isSearching, handleSearch, clearSearch };
};

const useMegaMenu = () => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredSubCategory, setHoveredSubCategory] = useState<string | null>(
    null
  );
  const [hoveredSubSubCategory, setHoveredSubSubCategory] = useState<
    string | null
  >(null);

  const handleProductsHover = useCallback(() => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setIsMegaMenuOpen(true);
  }, [hoverTimeout]);

  const handleProductsLeave = useCallback(() => {
    const timeout = setTimeout(() => {
      setIsMegaMenuOpen(false);
      setHoveredCategory(null);
      setHoveredSubCategory(null);
      setHoveredSubSubCategory(null);
    }, HOVER_DELAY);
    setHoverTimeout(timeout);
  }, []);

  const handleCategoryHover = useCallback(
    (categoryId: string) => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      setHoveredCategory(categoryId);
    },
    [hoverTimeout]
  );

  const handleSubCategoryHover = useCallback(
    (subCategoryId: string) => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      setHoveredSubCategory(subCategoryId);
      setHoveredSubSubCategory(null);
    },
    [hoverTimeout]
  );

  const handleSubSubCategoryHover = useCallback(
    (subSubCategoryId: string) => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      setHoveredSubSubCategory(subSubCategoryId);
    },
    [hoverTimeout]
  );

  const closeMegaMenu = useCallback(() => {
    setIsMegaMenuOpen(false);
    setHoveredCategory(null);
    setHoveredSubCategory(null);
    setHoveredSubSubCategory(null);
  }, []);

  return {
    isMegaMenuOpen,
    hoveredCategory,
    hoveredSubCategory,
    hoveredSubSubCategory,
    handleProductsHover,
    handleProductsLeave,
    handleCategoryHover,
    handleSubCategoryHover,
    handleSubSubCategoryHover,
    closeMegaMenu,
  };
};

const useMobileMenu = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileMenuState, setMobileMenuState] = useState<{
    currentView: "main" | "categories" | "subcategories" | "subsubcategories";
    selectedCategory: NavbarCategory | null;
    selectedSubCategory: Category | null;
    selectedSubSubCategory: SubCategory | null;
    breadcrumbs: Array<{ name: string; action: () => void }>;
  }>({
    currentView: "main",
    selectedCategory: null,
    selectedSubCategory: null,
    selectedSubSubCategory: null,
    breadcrumbs: [],
  });

  const toggleMobileMenu = useCallback(() => {
    setMobileNavOpen(!mobileNavOpen);
  }, [mobileNavOpen]);

  const closeMobileMenu = useCallback(() => {
    setMobileNavOpen(false);
    setMobileMenuState({
      currentView: "main",
      selectedCategory: null,
      selectedSubCategory: null,
      selectedSubSubCategory: null,
      breadcrumbs: [],
    });
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileNavOpen]);

  return {
    mobileNavOpen,
    mobileMenuState,
    setMobileMenuState,
    toggleMobileMenu,
    closeMobileMenu,
  };
};

// Main component
const Navbar = () => {
  const pathname = usePathname();
  const { isScrolled } = useScrollDetection();
  const { searchQuery, searchResults, isSearching, handleSearch, clearSearch } =
    useSearch();
  const megaMenu = useMegaMenu();
  const mobileMenu = useMobileMenu();

  // State
  const [navbarCategories, setNavbarCategories] = useState<NavbarCategory[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [activeSection, setActiveSection] = useState("");

  // Refs
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Data fetching
  const fetchData = useCallback(async () => {
    try {
      const [navbarResponse, categoriesResponse, subcategoriesResponse] =
        await Promise.all([
          fetch("/api/navbarcategories"),
          fetch("/api/categories"),
          fetch("/api/subcategories"),
        ]);

      const [navbarData, categoriesData, subcategoriesData] = await Promise.all(
        [
          navbarResponse.json(),
          categoriesResponse.json(),
          subcategoriesResponse.json(),
        ]
      );

      // Build nested subcategories
      const buildSubCategories = (
        parentId: string,
        allSubCategories: any[]
      ): SubCategory[] => {
        return allSubCategories
          .filter((subcategory: any) => subcategory.parentId === parentId)
          .map((subcategory: any) => ({
            id: subcategory._id || "",
            name: subcategory.name || "",
            slug: subcategory.slug || "",
            products: [],
            subCategories: buildSubCategories(
              subcategory._id,
              allSubCategories
            ),
          }));
      };

      const formattedData = navbarData.map((navbarCategory: any) => ({
        id: navbarCategory._id || "",
        name: navbarCategory.name || "",
        slug: navbarCategory.slug || "",
        categories: categoriesData
          .filter(
            (category: any) => category.navbarCategoryId === navbarCategory._id
          )
          .map((category: any) => ({
            id: category._id || "",
            name: category.name || "",
            slug: category.slug || "",
            subCategories: subcategoriesData
              .filter(
                (subcategory: any) =>
                  subcategory.categoryId === category._id &&
                  !subcategory.parentId
              )
              .map((subcategory: any) => ({
                id: subcategory._id || "",
                name: subcategory.name || "",
                slug: subcategory.slug || "",
                products: [],
                subCategories: buildSubCategories(
                  subcategory._id,
                  subcategoriesData
                ),
              })),
          })),
      }));

      setNavbarCategories(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setNavbarCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Navigation helpers
  const isActiveRoute = useCallback(
    (href: string, activeSection: string) => {
      if (href === "/") {
        return activeSection === "home";
      }
      if (href === "/products") {
        return (
          activeSection === "products" ||
          currentPath.includes("/products/") ||
          currentPath.includes("/category/") ||
          currentPath.includes("/subcategory/")
        );
      }
      return activeSection.startsWith(href.slice(1));
    },
    [currentPath]
  );

  const isPathActive = useCallback(
    (href: string) => {
      if (!href) return false;
      if (href === "/products") {
        return (
          currentPath === href ||
          currentPath.startsWith("/products/") ||
          currentPath.includes("/category/") ||
          currentPath.includes("/subcategory/")
        );
      }
      return currentPath === href || currentPath.startsWith(href + "/");
    },
    [currentPath]
  );

  // Event handlers
  const handleLinkClick = useCallback(() => {
    megaMenu.closeMegaMenu();
    mobileMenu.closeMobileMenu();
    setIsSearchBarVisible(false);
    clearSearch();
  }, [megaMenu, mobileMenu, clearSearch]);

  const toggleSearchBar = useCallback(() => {
    setIsSearchBarVisible(!isSearchBarVisible);
  }, [isSearchBarVisible]);

  // Mobile menu navigation handlers
  const handleProductsClick = useCallback(() => {
    mobileMenu.setMobileMenuState({
      currentView: "categories",
      selectedCategory: null,
      selectedSubCategory: null,
      selectedSubSubCategory: null,
      breadcrumbs: [{ name: "Menu", action: () => handleBackToMain() }],
    });
  }, []);

  const handleCategoryClick = useCallback((category: NavbarCategory) => {
    mobileMenu.setMobileMenuState({
      currentView: "subcategories",
      selectedCategory: category,
      selectedSubCategory: null,
      selectedSubSubCategory: null,
      breadcrumbs: [
        { name: "Menu", action: () => handleBackToMain() },
        { name: "Categories", action: () => handleBackToCategories() },
      ],
    });
  }, []);

  const handleBackToMain = useCallback(() => {
    mobileMenu.setMobileMenuState({
      currentView: "main",
      selectedCategory: null,
      selectedSubCategory: null,
      selectedSubSubCategory: null,
      breadcrumbs: [],
    });
  }, []);

  const handleBackToCategories = useCallback(() => {
    mobileMenu.setMobileMenuState({
      currentView: "categories",
      selectedCategory: null,
      selectedSubCategory: null,
      selectedSubSubCategory: null,
      breadcrumbs: [{ name: "Menu", action: () => handleBackToMain() }],
    });
  }, []);

  // Effects
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const path = pathname || "/";
    const section = path.split("/")[1];
    setActiveSection(section || "home");
    setCurrentPath(path);
  }, [pathname]);

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const megaMenuElement = document.getElementById("mega-menu");
      const megaMenuButton = document.getElementById("mega-menu-button");
      const mobileMenuElement = document.getElementById("mobile-menu");

      if (megaMenuElement && megaMenuButton) {
        if (
          !megaMenuElement.contains(event.target as Node) &&
          !megaMenuButton.contains(event.target as Node)
        ) {
          megaMenu.closeMegaMenu();
        }
      }

      if (
        mobileMenuElement &&
        !mobileMenuElement.contains(event.target as Node) &&
        mobileMenu.mobileNavOpen
      ) {
        mobileMenu.closeMobileMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [megaMenu, mobileMenu]);

  // Close search bar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchBar = document.getElementById("search-bar-container");
      const searchButton = document.getElementById("search-button");

      if (
        searchBar &&
        searchButton &&
        !searchBar.contains(event.target as Node) &&
        !searchButton.contains(event.target as Node)
      ) {
        setIsSearchBarVisible(false);
        clearSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clearSearch]);

  return (
    <>
      <nav className="fixed top-0 w-full z-50">
        {/* Top Black Bar */}
        <div
          className={`transition-all duration-300 flex items-center justify-between px-4 sm:px-6 lg:px-8 ${
            isScrolled
              ? "h-0 overflow-hidden opacity-0"
              : "h-16 sm:h-20 bg-black opacity-100"
          }`}
        >
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src={logo}
                alt="Lovosis Logo"
                width={140}
                height={50}
                className="object-contain w-auto h-8 sm:h-10 lg:h-12"
                priority
              />
            </Link>
          </div>

          {/* Contact Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <a
              href="tel:+917012970281"
              className="text-white hover:text-gray-300 transition-colors duration-200"
              aria-label="Call us"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </a>
            <a
              href="mailto:info@lovosis.com"
              className="text-white hover:text-gray-300 transition-colors duration-200"
              aria-label="Email us"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 012 2z"
                />
              </svg>
            </a>
            <Link
              href="https://www.google.com/maps/place/Lovosis+Technology+Private+limited/@13.075368,77.533578,17z/data=!4m6!3m5!1s0x3bae23e28f4d4575:0x82fc68d725417776!8m2!3d13.0753677!4d77.5335779!16s%2Fg%2F11wy3573dv?hl=en&entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              className="text-white hover:text-gray-300 transition-colors duration-200"
              title="Find Us"
            >
              <MapPin className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Main White Navbar */}
        <div className="transition-all duration-300 bg-white shadow-md text-gray-900 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              {/* Logo - Show when scrolled */}
              <div
                className={`transition-all duration-300 flex-shrink-0 ${
                  isScrolled || megaMenu.isMegaMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4"
                }`}
              >
                <Link href="/" className="flex items-center">
                  <Image
                    src={logo}
                    alt="Lovosis Logo"
                    width={120}
                    height={40}
                    className="object-contain w-auto h-6 sm:h-8 lg:h-10"
                    priority
                  />
                </Link>
              </div>

              {/* Menu Items - Desktop */}
              <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                {MAIN_NAV_ITEMS.map((item) => (
                  <div key={item.name} className="relative">
                    {item.hasDropdown ? (
                      <button
                        id="mega-menu-button"
                        onMouseEnter={megaMenu.handleProductsHover}
                        onMouseLeave={megaMenu.handleProductsLeave}
                        className={`text-sm xl:text-base font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-cyan-600 after:transition-all after:duration-300 after:ease-out ${
                          isPathActive(item.href) || isActiveRoute(item.href, activeSection)
                            ? "text-cyan-600 after:w-full"
                            : "text-gray-700 hover:text-cyan-600 after:w-0 hover:after:w-full"
                        }`}
                      >
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`text-sm xl:text-base font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-cyan-600 after:transition-all after:duration-300 after:ease-out ${
                          isPathActive(item.href) || isActiveRoute(item.href, activeSection)
                            ? "text-cyan-600 after:w-full"
                            : "text-gray-700 hover:text-cyan-600 after:w-0 hover:after:w-full"
                        }`}
                        onClick={handleLinkClick}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Right side icons */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Search Icon */}
                <button
                  id="search-button"
                  onClick={toggleSearchBar}
                  className="p-2 text-gray-600 hover:text-black transition-colors duration-200"
                  aria-label="Toggle search"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                {/* Contact Us Button */}
                <div className="hidden sm:block">
                  <Link
                    href="/contact"
                    className="px-4 py-2 sm:px-5 sm:py-2.5 lg:px-7 lg:py-3 border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <span className="hidden lg:inline">Contact Us</span>
                    <span className="lg:hidden">Contact</span>
                  </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={mobileMenu.toggleMobileMenu}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Toggle menu"
                  aria-expanded={mobileMenu.mobileNavOpen}
                >
                  <div className="w-6 h-6 relative">
                    <span
                      className={`absolute w-full h-0.5 bg-gray-900 transform transition-all duration-300 ${
                        mobileMenu.mobileNavOpen ? "rotate-45 top-3" : "top-1"
                      }`}
                    />
                    <span
                      className={`absolute w-full h-0.5 bg-gray-900 top-3 transition-opacity duration-300 ${
                        mobileMenu.mobileNavOpen ? "opacity-0" : "opacity-100"
                      }`}
                    />
                    <span
                      className={`absolute w-full h-0.5 bg-gray-900 transform transition-all duration-300 ${
                        mobileMenu.mobileNavOpen ? "-rotate-45 top-3" : "top-5"
                      }`}
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchBarVisible && (
          <div
            id="search-bar-container"
            className="absolute top-full left-0 w-full bg-white border-t border-b border-gray-200 shadow-lg"
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 py-4 md:py-6 px-4 sm:px-6 lg:px-8">
                {/* Search Input with Close Button */}
                <div className="col-span-1 md:col-span-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full px-4 py-2 pr-20 border-b-2 border-gray-200 focus:border-cyan-500 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-0 transition-colors duration-200"
                      autoFocus
                      style={{
                        WebkitTextFillColor: "#111827",
                      }}
                    />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                      {isSearching ? (
                        <div className="mr-3">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-cyan-600"></div>
                        </div>
                      ) : (
                        searchQuery && (
                          <button
                            onClick={clearSearch}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            aria-label="Clear search"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )
                      )}
                      <button
                        onClick={() => {
                          setIsSearchBarVisible(false);
                          clearSearch();
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        aria-label="Close search"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Links - Hidden on mobile */}
                <div className="hidden md:block md:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {searchQuery ? (
                      // Search Results
                      searchResults.length > 0 ? (
                        <div className="col-span-1 md:col-span-3">
                          <h3 className="text-sm font-medium text-gray-900 mb-3">
                            Search Results
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {searchResults.map((result, index) => (
                              <Link
                                key={index}
                                href={result.url}
                                className="group p-3 rounded-lg hover:bg-gray-50"
                                onClick={() => {
                                  clearSearch();
                                  setIsSearchBarVisible(false);
                                }}
                              >
                                <div className="font-medium text-gray-900 group-hover:text-cyan-600">
                                  {result.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {result.type}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="col-span-1 md:col-span-3 text-center py-4">
                          <p className="text-gray-500">No results found</p>
                        </div>
                      )
                    ) : (
                      // Popular Categories/Products
                      <>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-3">
                            Popular Categories
                          </h3>
                          <ul className="space-y-2">
                            {navbarCategories.slice(0, 5).map((category) => (
                              <li key={category.id}>
                                <Link
                                  href={`/products/${category.slug}`}
                                  className="text-sm text-gray-600 hover:text-cyan-600"
                                  onClick={() => {
                                    clearSearch();
                                    setIsSearchBarVisible(false);
                                  }}
                                >
                                  {category.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Mobile Search Results */}
                {searchQuery && (
                  <div className="md:hidden col-span-1">
                    {searchResults.length > 0 ? (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Search Results
                        </h3>
                        {searchResults.map((result, index) => (
                          <Link
                            key={index}
                            href={result.url}
                            className="block p-3 rounded-lg hover:bg-gray-50"
                            onClick={() => {
                              clearSearch();
                              setIsSearchBarVisible(false);
                            }}
                          >
                            <div className="font-medium text-gray-900">
                              {result.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {result.type}
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500">No results found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mega Menu - Desktop */}
        {megaMenu.isMegaMenuOpen && (
          <div
            id="mega-menu"
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-200 z-40"
            onMouseEnter={megaMenu.handleProductsHover}
            onMouseLeave={megaMenu.handleProductsLeave}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
              <div className="flex">
                {/* Main Categories */}
                <div className="w-1/4 border-r border-gray-200 pr-6">
                  <h3 className="text-lg font-semibold text-cyan-600 mb-4 pb-2 border-b border-gray-200">
                    Product Categories
                  </h3>
                  <div className="space-y-1">
                    {navbarCategories.map((navbarCategory) => (
                      <div
                        key={navbarCategory.id}
                        className="relative"
                        onMouseEnter={() =>
                          megaMenu.handleCategoryHover(navbarCategory.id)
                        }
                      >
                        <Link
                          href={`/products/${navbarCategory.slug}`}
                          className={`block px-3 py-2 text-sm font-medium transition-all duration-200 ${
                            megaMenu.hoveredCategory === navbarCategory.id
                              ? "text-cyan-600 bg-cyan-50"
                              : "text-gray-700 hover:text-cyan-600 hover:bg-cyan-50"
                          } rounded-md`}
                          onClick={handleLinkClick}
                        >
                          {navbarCategory.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link
                      href="/products"
                      className="inline-flex items-center text-sm font-medium text-gray-800 hover:text-cyan-600 transition-colors duration-200 px-3"
                      onClick={handleLinkClick}
                    >
                      View All Products
                      <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>

                {/* Categories */}
                <div className="w-1/4 border-r border-gray-200 px-6">
                  {megaMenu.hoveredCategory ? (
                    <div className="space-y-6">
                      {navbarCategories
                        .filter(
                          (navbarCategory) =>
                            navbarCategory.id === megaMenu.hoveredCategory
                        )
                        .map((navbarCategory) => (
                          <div key={navbarCategory.id}>
                            <h4 className="text-lg font-semibold text-cyan-600 mb-4 pb-2 border-b border-gray-200">
                              {navbarCategory.name}
                            </h4>
                            <div className="space-y-1">
                              {navbarCategory.categories.map((category) => (
                                <div
                                  key={category.id}
                                  className="relative"
                                  onMouseEnter={() =>
                                    megaMenu.handleSubCategoryHover(category.id)
                                  }
                                >
                                  <Link
                                    href={`/products/${navbarCategory.slug}/${category.slug}`}
                                    className={`block px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                      megaMenu.hoveredSubCategory ===
                                      category.id
                                        ? "text-cyan-600 bg-cyan-50"
                                        : "text-gray-700 hover:text-cyan-600 hover:bg-cyan-50"
                                    } rounded-md`}
                                    onClick={handleLinkClick}
                                  >
                                    {category.name}
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <svg
                          className="w-16 h-16 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        Browse Our Products
                      </h4>
                      <p className="text-gray-500">
                        Hover over a category to see subcategories and products
                      </p>
                    </div>
                  )}
                </div>

                {/* Subcategories */}
                <div className="flex-1 pl-6">
                  {megaMenu.hoveredCategory && megaMenu.hoveredSubCategory ? (
                    <div className="space-y-6">
                      {navbarCategories
                        .filter(
                          (navbarCategory) =>
                            navbarCategory.id === megaMenu.hoveredCategory
                        )
                        .map((navbarCategory) => (
                          <div key={navbarCategory.id}>
                            {navbarCategory.categories
                              .filter(
                                (category) =>
                                  category.id === megaMenu.hoveredSubCategory
                              )
                              .map((category) => (
                                <div key={category.id}>
                                  <h4 className="text-lg font-semibold text-cyan-600 mb-4 pb-2 border-b border-gray-200">
                                    {category.name}
                                  </h4>
                                  <div className="space-y-1">
                                    {category.subCategories.map(
                                      (subCategory) => (
                                        <div
                                          key={subCategory.id}
                                          className="relative"
                                          onMouseEnter={() =>
                                            megaMenu.handleSubSubCategoryHover(
                                              subCategory.id
                                            )
                                          }
                                        >
                                          <Link
                                            href={`/products/${navbarCategory.slug}/${category.slug}/${subCategory.slug}`}
                                            className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-cyan-600 hover:bg-cyan-50 rounded-md transition-all duration-200"
                                            onClick={handleLinkClick}
                                          >
                                            {subCategory.name}
                                          </Link>

                                          {/* Nested subcategories */}
                                          {megaMenu.hoveredSubSubCategory ===
                                            subCategory.id &&
                                            subCategory.subCategories &&
                                            subCategory.subCategories.length >
                                              0 && (
                                              <div className="mt-2 ml-4 space-y-1">
                                                {subCategory.subCategories.map(
                                                  (nestedSubCategory) => (
                                                    <Link
                                                      key={nestedSubCategory.id}
                                                      href={`/products/${navbarCategory.slug}/${category.slug}/${subCategory.slug}/${nestedSubCategory.slug}`}
                                                      className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-cyan-600 hover:bg-cyan-50 rounded-md transition-all duration-200"
                                                      onClick={handleLinkClick}
                                                    >
                                                      {nestedSubCategory.name}
                                                    </Link>
                                                  )
                                                )}
                                              </div>
                                            )}
                                        </div>
                                      )
                                    )}

                                    {category.subCategories.length > 8 && (
                                      <Link
                                        href={`/products/${navbarCategory.slug}/${category.slug}`}
                                        className="block text-sm text-cyan-600 hover:text-cyan-700 font-medium mt-2 px-3"
                                        onClick={handleLinkClick}
                                      >
                                        View All (
                                        {category.subCategories.length})
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <svg
                          className="w-16 h-16 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        Select a Category
                      </h4>
                      <p className="text-gray-500">
                        Hover over a category to see its subcategories
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {mobileMenu.mobileNavOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden fixed inset-0 z-50 overflow-hidden"
        >
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
              mobileMenu.mobileNavOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={mobileMenu.toggleMobileMenu}
          />

          {/* Menu Panel */}
          <div
            className={`fixed inset-y-0 right-0 w-full sm:w-[380px] bg-white shadow-2xl transform transition-all duration-300 ease-out ${
              mobileMenu.mobileNavOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {mobileMenu.mobileMenuState.currentView !== "main" && (
                    <button
                      onClick={() => {
                        if (
                          mobileMenu.mobileMenuState.currentView ===
                          "categories"
                        ) {
                          handleBackToMain();
                        } else if (
                          mobileMenu.mobileMenuState.currentView ===
                          "subcategories"
                        ) {
                          handleBackToCategories();
                        }
                      }}
                      className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                      aria-label="Go back"
                    >
                      <svg
                        className="w-5 h-5 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Logo */}
                <div className="flex items-center justify-center">
                  <Link href="/" className="flex items-center">
                    <Image
                      src={logo}
                      alt="Lovosis Logo"
                      width={110}
                      height={36}
                      className="object-contain w-auto h-7"
                    />
                  </Link>
                </div>

                {/* Close button */}
                <button
                  onClick={mobileMenu.toggleMobileMenu}
                  className="p-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 hover:scale-105"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Breadcrumbs */}
              {mobileMenu.mobileMenuState.breadcrumbs.length > 0 && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  {mobileMenu.mobileMenuState.breadcrumbs.map(
                    (breadcrumb, index) => (
                      <div key={index} className="flex items-center">
                        <button
                          onClick={breadcrumb.action}
                          className="hover:text-cyan-600 transition-colors duration-200"
                        >
                          {breadcrumb.name}
                        </button>
                        {index <
                          mobileMenu.mobileMenuState.breadcrumbs.length - 1 && (
                          <svg
                            className="w-4 h-4 mx-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="overflow-y-auto h-[calc(100vh-140px)] bg-gradient-to-b from-gray-50/50 to-white">
              <div className="p-4">
                {/* Main Menu */}
                {mobileMenu.mobileMenuState.currentView === "main" && (
                  <div className="space-y-3">
                    {MAIN_NAV_ITEMS.map((item, index) => (
                      <div
                        key={item.name}
                        className="transform transition-all duration-300 ease-out"
                        style={{
                          animationDelay: `${index * 50}ms`,
                          opacity: 0,
                          animation: "slideUp 0.4s ease-out forwards",
                        }}
                      >
                        {item.name === "Products" ? (
                          <button
                            onClick={handleProductsClick}
                            className={`group flex items-center justify-between w-full p-4 text-left rounded-xl transition-all duration-300 ${
                              currentPath.startsWith("/products") ||
                              currentPath.includes("/category/") ||
                              currentPath.includes("/subcategory/")
                                ? "text-cyan-700 bg-cyan-50 border-l-4 border-cyan-600"
                                : "bg-white hover:bg-gray-50 hover:border-l-4 hover:border-cyan-300"
                            }`}
                          >
                            <span
                              className={`font-semibold tracking-wide ${
                                currentPath.startsWith("/products") ||
                                currentPath.includes("/category/") ||
                                currentPath.includes("/subcategory/")
                                  ? "text-cyan-700"
                                  : "text-gray-900 group-hover:text-gray-700"
                              } transition-colors duration-200`}
                            >
                              {item.name}
                            </span>
                            <span className="ml-2 text-sm text-gray-400 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-transform">
                              &gt;
                            </span>
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                              isPathActive(item.href)
                                ? "text-cyan-700 bg-cyan-50 border-l-4 border-cyan-600"
                                : "text-gray-900 hover:bg-gray-50 hover:border-l-4 hover:border-cyan-300"
                            }`}
                            onClick={mobileMenu.toggleMobileMenu}
                          >
                            <span
                              className={`font-semibold tracking-wide ${
                                isPathActive(item.href)
                                  ? "text-cyan-700"
                                  : "group-hover:text-gray-700"
                              } transition-colors duration-200`}
                            >
                              {item.name}
                            </span>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Categories View */}
                {mobileMenu.mobileMenuState.currentView === "categories" && (
                  <div className="space-y-3">
                    {navbarCategories.map((category, index) => (
                      <div
                        key={category.id}
                        className="transform transition-all duration-300 ease-out"
                        style={{
                          animationDelay: `${index * 50}ms`,
                          opacity: 0,
                          animation: "slideUp 0.4s ease-out forwards",
                        }}
                      >
                        {category.categories.length > 0 ? (
                          <button
                            onClick={() => handleCategoryClick(category)}
                            className={`group flex items-center justify-between w-full p-4 text-left rounded-xl transition-all duration-300 ${
                              isPathActive(`/products/${category.slug}`)
                                ? "bg-cyan-50 border-l-4 border-cyan-600"
                                : "bg-white hover:bg-gray-50 hover:border-l-4 hover:border-cyan-300"
                            }`}
                          >
                            <span className="font-semibold text-gray-900 group-hover:text-cyan-700 transition-colors duration-200">
                              {category.name}
                            </span>
                            <span className="text-gray-400">&gt;</span>
                          </button>
                        ) : (
                          <Link
                            href={`/products/${category.slug}`}
                            className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                              isPathActive(`/products/${category.slug}`)
                                ? "bg-cyan-50 border-l-4 border-cyan-600"
                                : "bg-white hover:bg-gray-50 hover:border-l-4 hover:border-cyan-300"
                            }`}
                            onClick={mobileMenu.toggleMobileMenu}
                          >
                            <span className="font-semibold text-gray-900 group-hover:text-cyan-700">
                              {category.name}
                            </span>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Subcategories View */}
                {mobileMenu.mobileMenuState.currentView === "subcategories" &&
                  mobileMenu.mobileMenuState.selectedCategory && (
                    <div className="space-y-3">
                      {mobileMenu.mobileMenuState.selectedCategory.categories.map(
                        (category, index) => (
                          <div
                            key={category.id}
                            className="transform transition-all duration-300 ease-out"
                            style={{
                              animationDelay: `${index * 50}ms`,
                              opacity: 0,
                              animation: "slideUp 0.4s ease-out forwards",
                            }}
                          >
                            <Link
                              href={`/products/${mobileMenu.mobileMenuState.selectedCategory?.slug}/${category.slug}`}
                              className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                                isPathActive(
                                  `/products/${mobileMenu.mobileMenuState.selectedCategory?.slug}/${category.slug}`
                                )
                                  ? "bg-cyan-50 border-l-4 border-cyan-600"
                                  : "bg-white hover:bg-gray-50 hover:border-l-4 hover:border-cyan-300"
                              }`}
                              onClick={mobileMenu.toggleMobileMenu}
                            >
                              <span className="font-semibold text-gray-900 group-hover:text-cyan-700">
                                {category.name}
                              </span>
                            </Link>
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>

              {/* Footer Contact Section */}
              <div className="mt-auto p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                <div className="flex items-center justify-center gap-6">
                  <a
                    href="tel:+917012970281"
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                    aria-label="Call us"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </a>
                  <a
                    href="mailto:info@lovosis.com"
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                    aria-label="Email us"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 012 2z"
                      />
                    </svg>
                  </a>
                  <div
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"
                    aria-label="Location"
                  >
                    <Link
                      href="https://www.google.com/maps/place/Lovosis+Technology+Private+limited/@13.075368,77.533578,17z/data=!4m6!3m5!1s0x3bae23e28f4d4575:0x82fc68d725417776!8m2!3d13.0753677!4d77.5335779!16s%2Fg%2F11wy3573dv?hl=en&entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      className="text-gray-600 hover:text-cyan-600 transition-colors"
                      title="Find Us"
                    >
                      <MapPin className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Spacer for the fixed navbar */}
      <div
        className={`transition-all duration-300 ${
          isScrolled ? "h-14 sm:h-16" : "h-30 sm:h-36"
        }`}
      ></div>
    </>
  );
};

export default Navbar;
