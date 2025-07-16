import createMiddleware from "next-intl/middleware"

export default createMiddleware({
  // A list of all locales that are supported
  locales: ["ro", "ru", "en"],

  // Used when no locale matches
  defaultLocale: "ro",
})

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ro|ru|en)/:path*"],
}
