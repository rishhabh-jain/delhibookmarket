import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function UserReviews() {
  const ratingData = [
    { stars: 5, percentage: 86 },
    { stars: 4, percentage: 55 },
    { stars: 3, percentage: 15 },
    { stars: 2, percentage: 5 },
    { stars: 1, percentage: 1 },
  ];

  const renderStars = (rating: number, size: "sm" | "lg" = "sm") => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    const starSize = size === "lg" ? "w-6 h-6" : "w-4 h-4";

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={i}
            className={`${starSize} fill-orange-400 text-orange-400`}
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className={`${starSize} text-gray-300`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={`${starSize} fill-orange-400 text-orange-400`} />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className={`${starSize} text-gray-300`} />
        ))}
      </div>
    );
  };

  return (
    <div className=" mx-auto bg-white">
      {/* Header */}
      <div className="bg-yellow-300 text-center py-6 px-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          What our customers are saying
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Overall Rating */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                4.5 out of 5.0
              </div>
              <div className="text-gray-600 mt-1">1000+ ratings</div>
            </div>
            <div className="flex items-center">{renderStars(4.5, "lg")}</div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-3">
            {ratingData.map((item) => (
              <div key={item.stars} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium text-gray-700">
                  {item.stars} Star
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div
                    className="bg-orange-400 h-full rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${item.percentage}%` }}
                  >
                    <span className="text-white text-xs font-medium">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Review */}
        <div className="border-t pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-900">Rishita</div>
              <div className="text-sm text-gray-500">12/07/21</div>
            </div>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700"
            >
              Verified
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">4.5 stars</span>
            {renderStars(4.5)}
          </div>

          <p className="text-gray-700 leading-relaxed">
            I&apos;m a loyal customer here, and once again, you did not
            disappoint. The books arrived in excellent condition, and I am
            excited to dive into my new reads.
          </p>
        </div>

        <div className="border-t pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-900">Akshit</div>
              <div className="text-sm text-gray-500">04/12/22</div>
            </div>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700"
            >
              Verified
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">4.5 stars</span>
            {renderStars(5)}
          </div>

          <p className="text-gray-700 leading-relaxed">
            The customer service team was incredibly helpful when I had
            questions about my order. They went above and beyond to assist me.
            Highly recommended!
          </p>
        </div>

        <div className="border-t pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-900">Lallawmsangi</div>
              <div className="text-sm text-gray-500">04/12/22</div>
            </div>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700"
            >
              Verified
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">4.5 stars</span>
            {renderStars(5)}
          </div>

          <p className="text-gray-700 leading-relaxed">
            Great selection of books! Found exactly what I was looking for.
            Quick and hassle-free ordering process.
          </p>
        </div>

        <a href="https://shop.delhibookmarket.com/customer-reviews/">
          <button className="mt-4 text-sm hover:underline bg-blue-600 rounded-xl mx-auto text-white p-4 flex items-center justify-centerç">
            View All
          </button>
        </a>
      </div>
    </div>
  );
}
