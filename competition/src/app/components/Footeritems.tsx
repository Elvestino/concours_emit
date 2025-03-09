import Link from "next/link";
import { FooterItemType } from "./Items";
import Image from "next/image";

const FooterItem: React.FC<FooterItemType> = ({
  imageSrc,
  imageAlt,
  imageWidth,
  contact,
  lien,
}) => {
  return (
    <div className="mx-5">
      <Image src={imageSrc} width={imageWidth} alt={imageAlt} height={50} />
      <div className="text-black mt-4">
        <Link
          href={`${lien}`}
          className="text-gray-700 hover:underline italic font-semibold text-xs md:text-xl "
        >
          {`${contact}`}
        </Link>
      </div>
    </div>
  );
};

export default FooterItem;
