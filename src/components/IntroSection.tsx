"use client"

import { Heading } from "@/components/Heading"
import { Container } from "@/components/Container"

export function IntroSection() {
  return (
    <Container>
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-green-300/20 to-green-700/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-gradient-to-r from-green-500/20 to-green-800/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 -z-5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r from-green-100 to-green-500 rounded-full opacity-60 animate-float-${i + 1}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <div className="text-6xl md:text-7xl lg:text-8xl inline-block animate-bounce-gentle hover:animate-wave cursor-default">
          👋
        </div>
        
        <Heading className="font-black text-5xl md:text-6xl lg:text-7xl mt-4 leading-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900  bg-clip-text text-transparent animate-fade-in-up">
          <span className="inline-block ">Hello</span>{" "}
          <span className="inline-block">there!</span>{" "}
          <span className="inline-block">I&apos;m</span>{" "}
          <span className="inline-block font-extrabold bg-green-600  bg-clip-text text-transparent hover:animate-pulse delay-300 hover:scale-105 transition-transform duration-300">
            Aidan
          </span>
          <span className="inline-block text-green-500 ml-2">{` ☘️`}</span>
        </Heading>
        
        <div className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          <p className="animate-fade-in-up delay-500 hover:text-foreground transition-colors duration-300">
            A software engineer and student interested in{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent font-semibold transition-colors duration-500">
                building innovative tools
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-green-200 to-green-600 transform scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </span>
            .
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="mt-12 animate-fade-in-up delay-1000">
          <div className="mx-auto w-6 h-10 border-2 border-muted-foreground/30 rounded-full relative hover:border-foreground/50 transition-colors duration-300">
            <div className="w-1 h-3 bg-gradient-to-b from-green-200 to-green-500 rounded-full absolute left-1/2 top-2 transform -translate-x-1/2 animate-scroll-indicator"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-gentle {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
          }
          40%, 43% {
            transform: translate3d(0, -15px, 0);
          }
          70% {
            transform: translate3d(0, -8px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scroll-indicator {
          0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          50% {
            opacity: 0.3;
            transform: translateX(-50%) translateY(12px);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes float-1 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 33% { transform: translateY(-10px) rotate(120deg); } 66% { transform: translateY(5px) rotate(240deg); } }
        @keyframes float-2 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 33% { transform: translateY(-15px) rotate(-120deg); } 66% { transform: translateY(8px) rotate(-240deg); } }
        @keyframes float-3 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 33% { transform: translateY(-8px) rotate(90deg); } 66% { transform: translateY(12px) rotate(180deg); } }
        @keyframes float-4 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 33% { transform: translateY(-12px) rotate(-90deg); } 66% { transform: translateY(6px) rotate(-180deg); } }
        @keyframes float-5 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 33% { transform: translateY(-6px) rotate(60deg); } 66% { transform: translateY(10px) rotate(300deg); } }
        @keyframes float-6 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 33% { transform: translateY(-14px) rotate(-60deg); } 66% { transform: translateY(4px) rotate(-300deg); } }

        .animate-bounce-gentle { animation: bounce-gentle 2s infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-scroll-indicator { animation: scroll-indicator 2s infinite; }
        .animate-float-1 { animation: float-1 6s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 5s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 7s ease-in-out infinite; }
        .animate-float-4 { animation: float-4 4s ease-in-out infinite; }
        .animate-float-5 { animation: float-5 8s ease-in-out infinite; }
        .animate-float-6 { animation: float-6 5s ease-in-out infinite; }
      `}</style>
    </Container>
  )
}