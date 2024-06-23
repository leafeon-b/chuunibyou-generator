"use client";

import Link from "next/link";

// ナビゲーション
const Header = () => {
  return (
    <header className="mb-10 shadow-lg shadow-gray-100">
      <div className="container mx-auto flex max-w-screen-md items-center justify-between px-2 py-3">
        <Link href="/" className="cursor-pointer text-xl font-bold">
          厨二病メーカー
        </Link>
      </div>
    </header>
  );
};

export default Header;
