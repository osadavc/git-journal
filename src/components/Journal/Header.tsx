import Link from "next/link";

const Header = () => {
  return (
    <div className="flex max-w-7xl justify-between mx-auto h-[90px] items-center px-4">
      <Link href="/">
        <img src="/images/logo.png" alt="Logo" className="h-[55px]" />
      </Link>

      <img
        src="/images/user.png"
        alt="User Icon"
        className="cursor-pointer h-[50px]"
      />
    </div>
  );
};

export default Header;
