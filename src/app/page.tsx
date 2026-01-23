import Link from 'next/link'
import { Button } from '~/components/ui/button'
import { ModeToggle } from '~/components/ui/theme-toggle'
import {
  ArrowRight,
  CheckCircle2,
  Database,
  Layout,
  Lock,
  Server,
  Zap,
  Github,
} from 'lucide-react'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center px-4 sm:px-6 lg:px-8">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="hidden font-bold sm:inline-block">ACME Inc</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="#features"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Features
              </Link>
              <Link
                href="#docs"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Documentation
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none"></div>
            <nav className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
              <ModeToggle />
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center px-4">
            <h1 className="font-heading text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
              The Ultimate Next.js Boilerplate
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              A production-ready template featuring Next.js 15, Drizzle ORM,
              Better Auth, and Tailwind CSS. Everything you need to build your
              next big idea.
            </p>
            <div className="space-x-4">
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://github.com" target="_blank" rel="noreferrer">
                <Button variant="outline" size="lg" className="gap-2">
                  <Github className="h-4 w-4" /> GitHub
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="container mx-auto space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24 px-4"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
              Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              This template comes with a curated stack of the best tools in the
              React ecosystem.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <FeatureCard
              icon={<Layout className="h-10 w-10" />}
              title="Next.js 15"
              description="App Router, Server Components, and the latest features from Next.js."
            />
            <FeatureCard
              icon={<Database className="h-10 w-10" />}
              title="Drizzle ORM"
              description="Type-safe database access with Drizzle ORM and Neon Postgres."
            />
            <FeatureCard
              icon={<Lock className="h-10 w-10" />}
              title="Better Auth"
              description="Secure authentication with Better Auth, supporting multiple providers."
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10" />}
              title="Tailwind CSS"
              description="Rapidly build modern websites without ever leaving your HTML."
            />
            <FeatureCard
              icon={<CheckCircle2 className="h-10 w-10" />}
              title="Type Safe"
              description="End-to-end type safety with TypeScript and Zod."
            />
            <FeatureCard
              icon={<Server className="h-10 w-10" />}
              title="Server Actions"
              description="Mutate data on the server with Next.js Server Actions."
            />
          </div>
        </section>
      </main>
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{' '}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              You
            </a>
            . The source code is available on{' '}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
      <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
        <div className="space-y-2">
          <div className="text-primary">{icon}</div>
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}
