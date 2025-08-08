import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { Loader2, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// Type definitions
interface ProductImage {
  id?: number;
  src: string;
  name?: string;
  alt: string;
}

interface SearchIndexItem {
  id: number;
  name: string;
  slug: string;
  price: string;
  images: ProductImage[];
  stock_quantity: number;
  total_sales: number;
  permalink: string;
  normalizedName?: string;
  isComboProduct?: boolean;
  author?: string;
}

interface RelevanceScore {
  exactMatches: number;
  partialMatches: number;
  characterMatchScore: number;
  authorMatchScore: number;
  sales: number;
  isComboProduct: boolean;
  priority: "exact" | "partial" | "none";
}

interface SearchResult extends SearchIndexItem {
  relevance: RelevanceScore;
  bookFormat?: "paperback" | "hardcover" | "unknown";
}

// Book format detection keywords
const formatKeywords = {
  paperback: ["paperback", "pb", "paper back", "softcover", "soft cover"],
  hardcover: [
    "hardcover",
    "hc",
    "hard cover",
    "hardback",
    "hard back",
    "cloth",
  ],
};

// Synonyms mapping for better search
const synonyms: Record<string, string[]> = {
  boxset: ["box set", "set", "combo", "series", "collection"],
  set: ["boxset", "box set", "combo", "series", "collection"],
  combo: ["boxset", "box set", "set", "series", "collection"],
  series: ["boxset", "box set", "set", "combo", "collection"],
  collection: ["boxset", "box set", "set", "combo", "series"],
};

// Set-related keywords that indicate user wants combo products
const setKeywords = [
  "boxset",
  "box set",
  "set",
  "combo",
  "series",
  "collection",
  "complete",
  "bundle",
  "pack",
  "box",
  "sets",
];

const INITIAL_RESULTS_LIMIT = 8;
const LOAD_MORE_LIMIT = 6;

const AdvancedSearchBar: React.FC = () => {
  const [products, setProducts] = useState<SearchIndexItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);
  const [, setLoading] = useState<boolean>(true);
  const [displayLimit, setDisplayLimit] = useState<number>(
    INITIAL_RESULTS_LIMIT
  );
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProducts = async (): Promise<void> => {
      try {
        // Uncomment below for real API call
        const response = await fetch("/data/search-index.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: SearchIndexItem[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    setDisplayLimit(INITIAL_RESULTS_LIMIT);
  }, [searchTerm]);

  // Detect book format from product name
  const detectBookFormat = (
    productName: string
  ): "paperback" | "hardcover" | "unknown" => {
    const normalizedName = productName.toLowerCase();

    // Check for paperback keywords
    for (const keyword of formatKeywords.paperback) {
      if (normalizedName.includes(keyword)) {
        return "paperback";
      }
    }

    // Check for hardcover keywords
    for (const keyword of formatKeywords.hardcover) {
      if (normalizedName.includes(keyword)) {
        return "hardcover";
      }
    }

    return "unknown";
  };

  // Normalize text for better matching - removes special characters and contractions
  const normalizeText = (text: string): string => {
    return (
      text
        .toLowerCase()
        // Handle contractions: don't -> dont, can't -> cant, won't -> wont, etc.
        .replace(/won't/g, "wont")
        .replace(/can't/g, "cant")
        .replace(/n't/g, "nt")
        .replace(/('ll|'re|'ve|'d)/g, "")
        .replace(/'/g, "")
        // Remove all special characters except spaces
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    );
  };

  // Check if search term indicates user wants combo products
  const isSearchingForSets = (searchTerm: string): boolean => {
    const normalized = normalizeText(searchTerm);
    return setKeywords.some(
      (keyword) =>
        normalized.includes(keyword) ||
        normalized
          .split(" ")
          .some((word) => keyword.includes(word) || word.includes(keyword))
    );
  };

  // Get expanded search terms including synonyms
  const getExpandedSearchTerms = (searchTerm: string): string[] => {
    const normalized = normalizeText(searchTerm);
    const terms = normalized.split(" ");
    const expandedTerms = new Set(terms);

    const searchingForSets = isSearchingForSets(searchTerm);

    terms.forEach((term) => {
      if (searchingForSets && synonyms[term]) {
        synonyms[term].forEach((synonym) => expandedTerms.add(synonym));
      }
      if (searchingForSets) {
        Object.keys(synonyms).forEach((key) => {
          if (key.includes(term) || term.includes(key)) {
            synonyms[key].forEach((synonym) => expandedTerms.add(synonym));
          }
        });
      }
    });

    return Array.from(expandedTerms);
  };

  // Calculate character match accuracy including author matching
  const calculateCharacterMatchScore = (
    productName: string,
    searchTerm: string,
    authorName?: string
  ): { characterScore: number; authorScore: number } => {
    const normalizedProduct = normalizeText(productName);
    const normalizedSearch = normalizeText(searchTerm);
    const normalizedAuthor = authorName ? normalizeText(authorName) : "";

    // Calculate product name match
    let characterScore = 0;

    // Exact match gets highest score
    if (normalizedProduct.includes(normalizedSearch)) {
      characterScore = 100;
    } else {
      // Calculate character similarity
      const productWords = normalizedProduct.split(" ");
      const searchWords = normalizedSearch.split(" ");

      let totalScore = 0;
      let matchedWords = 0;

      searchWords.forEach((searchWord) => {
        let bestWordScore = 0;

        productWords.forEach((productWord) => {
          if (productWord === searchWord) {
            bestWordScore = 100; // Exact word match
          } else if (productWord.includes(searchWord)) {
            bestWordScore = Math.max(bestWordScore, 80); // Search word is substring
          } else if (searchWord.includes(productWord)) {
            bestWordScore = Math.max(bestWordScore, 70); // Product word is substring
          } else {
            // Calculate Levenshtein distance for partial matches
            const distance = levenshteinDistance(searchWord, productWord);
            const maxLength = Math.max(searchWord.length, productWord.length);
            const similarity = ((maxLength - distance) / maxLength) * 100;
            if (similarity > 60) {
              // Only consider if similarity is > 60%
              bestWordScore = Math.max(bestWordScore, similarity * 0.5);
            }
          }
        });

        if (bestWordScore > 0) {
          totalScore += bestWordScore;
          matchedWords++;
        }
      });

      characterScore = matchedWords > 0 ? totalScore / searchWords.length : 0;
    }

    // Calculate author match
    let authorScore = 0;
    if (normalizedAuthor) {
      if (normalizedAuthor.includes(normalizedSearch)) {
        authorScore = 90; // Slightly less than exact product match
      } else {
        const authorWords = normalizedAuthor.split(" ");
        const searchWords = normalizedSearch.split(" ");

        let authorTotalScore = 0;
        let authorMatchedWords = 0;

        searchWords.forEach((searchWord) => {
          authorWords.forEach((authorWord) => {
            if (authorWord === searchWord) {
              authorTotalScore += 90;
              authorMatchedWords++;
            } else if (
              authorWord.includes(searchWord) &&
              searchWord.length >= 3
            ) {
              authorTotalScore += 60;
              authorMatchedWords++;
            }
          });
        });

        authorScore =
          authorMatchedWords > 0 ? authorTotalScore / searchWords.length : 0;
      }
    }

    return { characterScore, authorScore };
  };

  // Simple Levenshtein distance implementation
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  };

  // Calculate relevance score with NEW priority system
  const calculateRelevanceScore = (
    product: SearchIndexItem,
    searchTerms: string[],
    originalSearchTerm: string
  ): RelevanceScore => {
    const productName = product.normalizedName || normalizeText(product.name);
    const productWords = productName.split(" ");
    // const searchingForSets = isSearchingForSets(originalSearchTerm);

    let exactMatches = 0;
    let partialMatches = 0;

    // Count exact and partial matches
    searchTerms.forEach((term) => {
      if (!term) return;

      if (productWords.includes(term)) {
        exactMatches++;
      } else if (
        term.length >= 3 &&
        productWords.some((word) => word.includes(term) || term.includes(word))
      ) {
        partialMatches++;
      }
    });

    // Calculate character match score and author match score
    const { characterScore, authorScore } = calculateCharacterMatchScore(
      product.name,
      originalSearchTerm,
      product.author
    );

    const isComboProduct =
      product.isComboProduct !== undefined
        ? product.isComboProduct
        : productWords.some((word) =>
            [
              "boxset",
              "box",
              "set",
              "combo",
              "series",
              "collection",
              "complete",
            ].includes(word)
          );

    // Determine priority category
    let priority: "exact" | "partial" | "none" = "none";
    if (exactMatches > 0 || characterScore > 80 || authorScore > 70) {
      priority = "exact";
    } else if (partialMatches > 0 || characterScore > 40 || authorScore > 40) {
      priority = "partial";
    }

    return {
      exactMatches,
      partialMatches,
      characterMatchScore: characterScore,
      authorMatchScore: authorScore,
      sales: product.total_sales || 0,
      isComboProduct,
      priority,
    };
  };

  // Search and filter products with NEW sorting logic
  const allSearchResults: SearchResult[] = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const searchTerms = getExpandedSearchTerms(searchTerm);
    const searchingForSets = isSearchingForSets(searchTerm);

    const results = products
      .map((product) => ({
        ...product,
        relevance: calculateRelevanceScore(product, searchTerms, searchTerm),
        bookFormat: detectBookFormat(product.name),
      }))
      .filter((product) => product.relevance.priority !== "none")
      .sort((a, b) => {
        // NEW PRIORITY SYSTEM - FIXED ORDER

        // Special case: If searching for sets, combo products get top priority
        if (searchingForSets) {
          if (a.relevance.isComboProduct !== b.relevance.isComboProduct) {
            return b.relevance.isComboProduct ? 1 : -1;
          }
        }

        // Priority 1: Character match accuracy (including author match)
        const aMatchScore = Math.max(
          a.relevance.characterMatchScore,
          a.relevance.authorMatchScore
        );
        const bMatchScore = Math.max(
          b.relevance.characterMatchScore,
          b.relevance.authorMatchScore
        );
        const charDiff = bMatchScore - aMatchScore;
        if (Math.abs(charDiff) > 10) {
          return charDiff;
        }

        // Priority 2: Number of sales
        const salesDiff = b.relevance.sales - a.relevance.sales;
        if (Math.abs(salesDiff) > 50) {
          return salesDiff;
        }

        // Priority 3: Combo products (bonus points)
        if (a.relevance.isComboProduct !== b.relevance.isComboProduct) {
          return b.relevance.isComboProduct ? -1 : 1;
        }

        // Priority 4: Author match as tiebreaker
        if (
          Math.abs(
            b.relevance.authorMatchScore - a.relevance.authorMatchScore
          ) > 5
        ) {
          return b.relevance.authorMatchScore - a.relevance.authorMatchScore;
        }

        // Final tiebreaker: exact matches, then partial matches
        if (b.relevance.exactMatches !== a.relevance.exactMatches) {
          return b.relevance.exactMatches - a.relevance.exactMatches;
        }

        return b.relevance.partialMatches - a.relevance.partialMatches;
      });

    return results;
  }, [products, searchTerm]);

  const displayedResults = useMemo(() => {
    return allSearchResults.slice(0, displayLimit);
  }, [allSearchResults, displayLimit]);

  const hasMoreResults = allSearchResults.length > displayLimit;

  const loadMoreResults = useCallback(async () => {
    if (isLoadingMore || !hasMoreResults) return;

    setIsLoadingMore(true);

    // Simulate loading delay (remove this in production)
    await new Promise((resolve) => setTimeout(resolve, 300));

    setDisplayLimit((prev) => prev + LOAD_MORE_LIMIT);
    setIsLoadingMore(false);
  }, [isLoadingMore, hasMoreResults]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMoreResults && !isLoadingMore) {
          loadMoreResults();
        }
      },
      {
        root: resultsContainerRef.current,
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    if (loadMoreTriggerRef.current) {
      observer.observe(loadMoreTriggerRef.current);
    }

    return () => {
      if (loadMoreTriggerRef.current) {
        observer.unobserve(loadMoreTriggerRef.current);
      }
    };
  }, [hasMoreResults, isLoadingMore, loadMoreResults]);

  // Helper function to get format badge styling
  const getFormatBadgeStyle = (
    format: "paperback" | "hardcover" | "unknown"
  ) => {
    switch (format) {
      case "paperback":
        return "px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex-shrink-0";
      case "hardcover":
        return "px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full flex-shrink-0";
      default:
        return "px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full flex-shrink-0";
    }
  };

  // Helper function to get format display text
  const getFormatDisplayText = (
    format: "paperback" | "hardcover" | "unknown"
  ) => {
    switch (format) {
      case "paperback":
        return "Paperback";
      case "hardcover":
        return "Hardcover";
      default:
        return "";
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(value.trim().length > 0);
  };

  const clearSearch = (): void => {
    setSearchTerm("");
    setShowResults(false);
  };

  const router = useRouter();

  const handleResultClick = (product: SearchIndexItem): void => {
    router.push(product.slug);
    setShowResults(false);
  };

  const handleManualSearch = (s: string) => {
    router.push(`/s/${s}`);
    setShowResults(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Escape") {
      clearSearch();
    } else if (e.key === "Enter") {
      handleManualSearch(searchTerm);
    }
  };

  // const searchingForSets = isSearchingForSets(searchTerm);

  return (
    <div className="w-full max-w-2xl mx-auto ">
      <div className="relative mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            placeholder="Search for books, series, box sets..."
            className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            onFocus={() => searchTerm.trim() && setShowResults(true)}
          />
          {searchTerm && (
            <button
              className="absolute right-12 border-zinc-700 border rounded-lg top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10 p-2"
              onClick={() => {
                handleManualSearch(searchTerm);
              }}
              onKeyDown={() => {
                handleManualSearch(searchTerm);
              }}
            >
              <Search size={18} />
              {""}
            </button>
          )}

          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Results */}
        {showResults && (
          <div
            ref={resultsContainerRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            {displayedResults.length > 0 ? (
              <>
                <div className="px-3 py-2 text-sm text-gray-500 border-b bg-gray-50 flex items-center justify-between">
                  <span>
                    {displayedResults.length} result
                    {displayedResults.length !== 1 ? "s" : ""} found
                  </span>
                  {/* {searchingForSets && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      Sets & Collections Priority
                    </span>
                  )}
                  {!searchingForSets && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Match → Sales → Combo → Author
                    </span>
                  )} */}
                </div>
                {displayedResults.map((product) => (
                  <Link href={`/${product.slug}`} key={product.id}>
                    <div
                      onClick={() => handleResultClick(product)}
                      className="px-3 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleResultClick(product);
                        }
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <Image
                          src={product.images[0]?.src || ""}
                          width={48}
                          height={48}
                          alt={product.images[0]?.alt || product.name}
                          className="w-12 h-12 object-cover rounded border flex-shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://via.placeholder.com/48x48/e5e5e5/999999?text=Book";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900 truncate">
                              {product.name.replace(/^Buy\s+/i, "")}
                            </h3>

                            {/* {product.relevance.isComboProduct && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex-shrink-0">
                              Set
                            </span>
                          )} */}
                            {/* {!product.relevance.isComboProduct && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex-shrink-0">
                              Single
                            </span>
                          )} */}
                            {/* Book Format Badge */}
                            <span
                              className={getFormatBadgeStyle(
                                product.bookFormat!
                              )}
                            >
                              {getFormatDisplayText(product.bookFormat!)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-semibold text-green-600">
                              ₹{parseInt(product.price).toLocaleString()}
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              {/* <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              Match:{" "}
                              {Math.round(
                                Math.max(
                                  product.relevance.characterMatchScore,
                                  product.relevance.authorMatchScore
                                )
                              )}
                              %
                            </span> */}
                              {product.relevance.authorMatchScore >
                                product.relevance.characterMatchScore && (
                                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                                  Author
                                </span>
                              )}
                              {(product.total_sales || 0) > 500 && (
                                <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                {hasMoreResults && (
                  <div
                    ref={loadMoreTriggerRef}
                    className="px-3 py-4 text-center"
                  >
                    {isLoadingMore ? (
                      <div className="flex items-center justify-center space-x-2 text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Loading more results...</span>
                      </div>
                    ) : (
                      <button
                        onClick={loadMoreResults}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        Load more results (
                        {allSearchResults.length - displayedResults.length}{" "}
                        remaining)
                      </button>
                    )}
                  </div>
                )}

                {/* End of Results Indicator */}
                {!hasMoreResults &&
                  allSearchResults.length > INITIAL_RESULTS_LIMIT && (
                    <div className="px-3 py-2 text-center text-xs text-gray-500 bg-gray-50">
                      All results loaded
                    </div>
                  )}
              </>
            ) : (
              <div className="px-3 py-6 text-center text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="font-medium">
                  No products found for {searchTerm}
                </p>
                <p className="text-sm mt-1">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearchBar;
