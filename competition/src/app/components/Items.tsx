export type FooterItemType = {
  id: number;
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  contact: string;
  lien: string;
};

export const footerItems: FooterItemType[] = [
  {
    id: 1,
    imageSrc: "/assets/images/image4.png",
    imageAlt: "logo université",
    imageWidth: 90,
    contact: "UNIVERSITE-FIANARANTSOA",
    lien: "https://www.univ-fianarantsoa.mg",
  },
  {
    id: 2,
    imageSrc: "/assets/images/emifi.png",
    imageAlt: "logo EMIT",
    imageWidth: 200,
    lien: "https://www.facebook.com/profile.php?id=100063592256637",
    contact: "EMIFI",
  },
  {
    id: 3,
    imageSrc: "/assets/images/image2.png",
    imageAlt: "logo EMITECH",
    imageWidth: 200,
    contact: "EMITECH",
    lien: "https://www.facebook.com/EmiTechUF",
  },
];
