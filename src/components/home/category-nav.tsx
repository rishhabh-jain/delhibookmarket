import Link from "next/link";

const categories = [
  {
    id: 1,
    name: "Best selling",
    icon: "check-circle",
    color: "bg-black",
  },
  {
    id: 2,
    name: "New arrivals",
    icon: "new-badge",
    color: "bg-orange-400",
  },
  {
    id: 3,
    name: "Box sets",
    icon: "books",
    color: "bg-blue-500",
  },
  {
    id: 4,
    name: "Fiction books",
    icon: "person-walking",
    color: "bg-purple-500",
  },
  {
    id: 5,
    name: "Finance",
    icon: "chart",
    color: "bg-yellow-500",
  },
  {
    id: 6,
    name: "Non Fiction",
    icon: "crown",
    color: "bg-amber-500",
  },
];

export default function CategoryNav() {
  return (
    <div className="container px-4 py-2">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            className="flex flex-col items-center justify-center p-2 border rounded-lg hover:bg-gray-50"
          >
            <div
              className={`h-12 w-12 rounded-full ${category.color} flex items-center justify-center text-white mb-1`}
            >
              {category.icon === "check-circle" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              )}
              {category.icon === "new-badge" && (
                <span className="font-bold text-sm">NEW</span>
              )}
              {category.icon === "books" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              )}
              {category.icon === "person-walking" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="5" r="3"></circle>
                  <line x1="12" y1="22" x2="12" y2="8"></line>
                  <path d="M5 12h14"></path>
                </svg>
              )}
              {category.icon === "chart" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              )}
              {category.icon === "crown" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
                </svg>
              )}
            </div>
            <span className="text-xs text-center">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
