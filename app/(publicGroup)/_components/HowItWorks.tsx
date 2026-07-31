import { Search, CalendarCheck, CircleCheck } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Browse Gear",
    description:
      "Search our marketplace and filter by category, brand, and budget to find exactly what you need.",
  },
  {
    icon: CalendarCheck,
    title: "Book Your Dates",
    description:
      "Choose your rental dates, review the provider, and place your order in a few clicks.",
  },
  {
    icon: CircleCheck,
    title: "Pick Up & Enjoy",
    description:
      "Meet the provider, pick up your gear, and enjoy your activity. Return it when you're done.",
  },
]

export function HowItWorks() {
  return (
    <section className="bg-muted/50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">How GearUp Works</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Renting gear has never been easier
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center"
            >
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
