import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Highlight } from "@/components/Highlight";
import { Paragraph } from "@/components/Paragraph";
import { Products } from "@/components/Products";
import { TechStack } from "@/components/TechStack";
import Image from "next/image";

export default function Home() {
  return (
    <Container>
    <span className="text-4xl">👋</span>
    <Heading className="font-black">Hello there! I&apos;m Aidan</Heading>
    <Paragraph className="max-w-xl mt-4">
      I&apos;m a computer science student at <Highlight>UW–Madison</Highlight> with a passion for software development and AI.
    </Paragraph>
    <Paragraph className="max-w-xl mt-4">
      I enjoy solving real-world problems using <Highlight>machine learning</Highlight>, web technologies, and creative thinking.
    </Paragraph>
    <Paragraph className="max-w-xl mt-4">
      I&apos;ve worked on <Highlight>full-stack</Highlight> applications, led fundraising teams, and contributed to machine learning research—always aiming to work on something that matters.
    </Paragraph>
    <Heading
      as="h2"
      className="font-black text-lg md:text-lg lg:text-lg mt-20 mb-4"
    >
      What I&apos;ve been working on
    </Heading>
    <Products />
    <TechStack />
  </Container>
  );
}
