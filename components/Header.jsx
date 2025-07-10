import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 z-10 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex items-center mx-auto px-4 h-16 justify-between">
        <Link href="/">
          <Image
            src="/logo-single.png"
            alt="Medimeet logo"
            width={200}
            height={60}
            className="h-10 w-auto object-contain"
          />{" "}
        </Link>
        <div>
          <SignedOut>
            <SignInButton>
              <Button variant="secondary">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
