import Image from "next/image";

export default function Header() {
  return (
    <>
      <header className="animate-fade-in text-black  py-3 lg:py-5 md:py-5 px-7 lg:px-20 md:px-10 gap-20 flex justify-between items-center ">
        <h1 className="md:text-start md:text-2xl font-semibold text-xl">
          Tongasoa ato amin'ny FanevaMozika
        </h1>
        <div>
          <Image
            src={"/assets/images/image3.png"}
            alt="logo emitech"
            width={150}
            height={50}
          />
        </div>
      </header>
    </>
  );
}
