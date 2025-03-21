import FooterItem from "./Footeritems";
import { footerItems } from "./Items";

const Footer = () => {
  return (
    <footer className="text-white grid grid-cols-3 md:gap-20 animate-fade-in">
      {footerItems.map((item) => (
        <FooterItem key={item.id} {...item} />
      ))}
    </footer>
  );
};

export default Footer;
