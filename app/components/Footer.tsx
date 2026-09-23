export default function Footer() {
  return (
    <footer className="bg-[#0F2747] text-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold">OUI SIWES Portal</h2>

            <p className="mt-4 text-sm leading-6 text-white/70">
              A centralized platform for managing the SIWES and Entrepreneurship
              Programme journey from registration to completion.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#D4A72C]">
              Programme
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <a href="#about" className="transition hover:text-white">
                  About
                </a>
              </li>

              <li>
                <a href="#skills" className="transition hover:text-white">
                  Available Skills
                </a>
              </li>

              <li>
                <a
                  href="#how-it-works"
                  className="transition hover:text-white"
                >
                  How It Works
                </a>
              </li>

              <li>
                <a href="#faq" className="transition hover:text-white">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#D4A72C]">
              Students
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <a href="/register" className="transition hover:text-white">
                  Register
                </a>
              </li>

              <li>
                <a href="/login" className="transition hover:text-white">
                  Log In
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#D4A72C]">
              Contact
            </h3>

            <div className="mt-4 space-y-3 text-sm leading-6 text-white/70">
              <p>College of Entrepreneurial and Vocational Studies (CEVS)</p>

              <p>Ipetumodu, P.M.B. 5533, Ile-Ife, Nigeria</p>

              <p>
                <a
                  href="mailto:info@oduduwauniversity.edu.ng"
                  className="transition hover:text-white"
                >
                  info@oduduwauniversity.edu.ng
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/60">
          <p>
            © {new Date().getFullYear()} SIWES & Entrepreneurship Programme.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}