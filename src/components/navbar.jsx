"use client";
import { useId } from "react"
import { GlobeIcon } from "lucide-react"
import Logo from "@/components/logo"
import ThemeToggle from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"  // Alteração aqui

const navigationLinks = [
  { href: "#", label: "Home" },
  { href: "#sobre", label: "Sobre nós" },
  { href: "#blog", label: "Blog" },
  { href: "#contato", label: "Contato" },
]

const languages = [
  { value: "en", label: "English", flag: "./img/eua.png" },
  { value: "pt", label: "Português", flag: "./img/brasil.png" },
]

export default function Component() {
  const id = useId()
  const router = useRouter()

  // Função para alterar o idioma
  const handleLanguageChange = (lang) => {
    router.push(router.pathname, router.asPath, { locale: lang })
  }

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="group size-8 md:hidden" variant="ghost" size="icon">
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 12L20 12" />
                  <path d="M4 6H20" />
                  <path d="M4 18H20" />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <NavigationMenuLink
                        href={link.href}
                        className="py-1.5 px-2 text-sm hover:bg-accent rounded">
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>

          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href="#" className="text-primary hover:text-primary/90">
              <Logo />
            </a>
            {/* Desktop navigation - text only */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-4">
                {navigationLinks.map((link) => (
                  <NavigationMenuItem key={link.label}>
                    <NavigationMenuLink
                      href={link.href}
                      className="text-sm font-medium hover:underline">
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <ThemeToggle />

          {/* Language selector */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="group size-8" variant="ghost" size="icon">
                <GlobeIcon size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-36 p-1">
              <div className="flex flex-col gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang.value}
                    variant="ghost"
                    onClick={() => handleLanguageChange(lang.value)}
                    className="flex items-center gap-2 text-sm w-full">
                    <img src={lang.flag} alt={lang.label} className="w-6 h-4" />
                    {lang.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  )
}
