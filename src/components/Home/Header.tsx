import Link from "next/link";

const Header = () => {
  return (
    <div className="flex justify-between max-w-7xl mx-auto h-[90px] items-center px-4">
      <div></div>
      <Link href="/login">
        <img
          src="/images/user.png"
          alt="User Icon"
          className="cursor-pointer h-[70px]"
        />
      </Link>
    </div>
  );
};

export default Header;
