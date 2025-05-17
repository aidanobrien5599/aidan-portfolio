import { StaticImageData } from "next/image";

export type Product = {
  title: string;
  description: string;
  linktype: string;
  thumbnail: StaticImageData;
  images: StaticImageData[] | string[];
  href: string;
  slug?: string;
  stack?: string[];
  content?: React.ReactNode | string;
};
