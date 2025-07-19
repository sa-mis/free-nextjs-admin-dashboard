import React from "react";

export default function ThreeColumnImageGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="overflow-hidden">
        <img
          src="/images/grid-image/image-01.png"
          alt="Cover"
          className="w-full border border-gray-200 rounded-xl dark:border-gray-800"
          width={1054}
          height={600}
        />
      </div>
      <div className="overflow-hidden">
        <img
          src="/images/grid-image/image-02.png"
          alt="Cover"
          className="w-full border border-gray-200 rounded-xl dark:border-gray-800"
          width={1054}
          height={600}
        />
      </div>
      <div className="overflow-hidden">
        <img
          src="/images/grid-image/image-03.png"
          alt="Cover"
          className="w-full border border-gray-200 rounded-xl dark:border-gray-800"
          width={1054}
          height={600}
        />
      </div>
    </div>
  );
}
