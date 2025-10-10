import About from "@/components/About"
import { Container } from "@/components/Container"
import { Heading } from "@/components/Heading"
import { Products } from "@/components/Projects"
import { TechStack } from "@/components/TechStack"
import { IntroSection } from "@/components/IntroSection"
import { WorkHistory } from "@/components/WorkHistory"
import { Contact } from "@/components/Contact"

export default function Home() {
  return (
    <main>
      {/* Intro Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted ">
        <IntroSection />
      </section>

      {/* About Me Section */}
      <section id="about" className="min-h-screen flex flex-col items-center justify-center  bg-card text-card-foreground">
        <Container>
          <Heading as="h2" className="font-black text-3xl md:text-4xl lg:text-5xl">
            About Me
          </Heading>
          <About />
        </Container>
      </section>

      <section id="work" className="min-h-screen flex flex-col items-center justify-center py-12 md:py-24 lg:py-32 bg-background">
        <Container >
          <Heading as="h2" className="font-black text-3xl md:text-4xl lg:text-5xl mt-4 mb-8">
            What I&apos;ve been up to
          </Heading>
          <WorkHistory />
        </Container>
      </section>



      {/* Projects Section (using Products component) */}
      <section id="projects" className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Container >
          <Heading as="h2" className="font-black text-3xl md:text-4xl lg:text-5xl mt-4 mb-8">
            What I&apos;ve been working on
          </Heading>
          <Products />
        </Container>
      </section>

      {/* Tech Stack Section */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-card text-card-foreground">
        <Container>
          <Heading as="h2" className="font-black text-3xl md:text-4xl lg:text-5xl mt-4 mb-8">
            My Tech Stack
          </Heading>
          <TechStack />
        </Container>
      </section>

      <section id="contact"   className="min-h-screen flex flex-col items-center justify-center  bg-background">
        <Container> 
          <Heading as="h2" className="font-black text-3xl md:text-4xl lg:text-5xl mt-4 mb-8">
            Contact Me
          </Heading>
          <Contact />
        </Container>
      </section>
    </main>

    
  )
}