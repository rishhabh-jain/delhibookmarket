import Link from "next/link";
import {
  CheckCircle,
  Sparkles,
  BookOpen,
  User,
  TrendingUp,
  Crown,
} from "lucide-react";

const categories = [
  {
    id: "all",
    name: "Best selling",
    icon: CheckCircle,
    color: "bg-gray-800",
  },
  {
    id: "all",
    name: "New arrivals",
    icon: Sparkles,
    color: "bg-orange-500",
  },
  {
    id: "box-sets",
    name: "Box sets",
    icon: BookOpen,
    color: "bg-blue-500",
  },
  {
    id: "fiction",
    name: "Fiction books",
    icon: User,
    color: "bg-purple-500",
  },
  {
    id: "finance",
    name: "Finance",
    icon: TrendingUp,
    color: "bg-green-500",
  },
  {
    id: "non-fiction",
    name: "Non Fiction",
    icon: Crown,
    color: "bg-yellow-500",
  },
];

export default function CategoryNav() {
  return (
    <div className="container px-4 py-3">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {categories.map((category) => {
          const IconComponent = category.icon;

          return (
            <Link
              key={category.id}
              href={`/product-category/${category.id}`}
              className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg"
            >
              <div
                className={`h-10 w-10 rounded-full ${category.color} flex items-center justify-center text-white mb-1`}
              >
                <IconComponent size={18} />
              </div>
              <span className="text-xs text-gray-700 text-center">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
