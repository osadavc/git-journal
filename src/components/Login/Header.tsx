import Link from "next/link";

const Header = () => {
  return (
    <div className="flex max-w-7xl mx-auto h-[90px] items-center px-4">
      <Link href="/">
        <img src="/images/logo.png" alt="Logo" className="h-[55px]" />
      </Link>
      <h1 className="text-xl font-semibold ml-2">Git Journal</h1>
    </div>
  );
};

export default Header;
