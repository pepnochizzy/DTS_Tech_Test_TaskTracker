import Link from "next/link";

export default function Header() {
  return (
    <nav className="flex flex-row place-content-around bg-black text-white h-12 items-center">
      <Link href={"/"}>
        <p className="font-bold text-2xl">TASK.UK</p>
      </Link>
      <p className="font-bold">Task Tracker</p>
    </nav>
  );
}
