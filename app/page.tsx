import Link from "next/link";

import { FadeIn } from "@/components/fade-in";
import { StatCounter } from "@/components/homepage/stat-counter";
import { TiltCard } from "@/components/homepage/tilt-card";
import { MagneticButton } from "@/components/homepage/magnetic-button";

/** Replace with your Loom / video URL when ready */
const DEMO_LINK = "{{DEMO_LINK}}";

const PHONE = "+12262416407";
const PHONE_DISPLAY = "(226) 241-6407";

/* ── tiny inline SVG icons — no library deps ──────────────────────────── */

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0, marginTop: "2px" }}
    >
      <path
        d="M4 9.5L7.5 13L14 5"
        stroke="var(--orange)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li
      style={{
        display: "flex",
        gap: "10px",
        fontSize: "15px",
        lineHeight: 1.55,
        color: "var(--text-body)",
      }}
    >
      <CheckIcon />
      <span>{children}</span>
    </li>
  );
}

/* ── shared section padding ────────────────────────────────────────────── */

const SECTION_PY = "clamp(72px, 10vw, 148px)";

/* ═══════════════════════════════════════════════════════════════════════ */

export default function HomePage() {
  return (
    <>
      {/* ─── Sticky Nav ──────────────────────────────────────────────── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          background: "rgba(14, 15, 17, 0.82)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--max)",
            margin: "0 auto",
            padding: "0 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "56px",
          }}
        >
          <Link
            href="/"
            aria-label="Verbatim — home"
            style={{
              fontFamily: "var(--display)",
              fontSize: "22px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              textDecoration: "none",
            }}
          >
            verbatim
            <span style={{ color: "var(--orange)" }}>.</span>
          </Link>

          <a
            href={`tel:${PHONE}`}
            style={{
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.01em",
              color: "var(--bg)",
              textDecoration: "none",
              padding: "8px 20px",
              borderRadius: "999px",
              background: "var(--orange)",
            }}
          >
            Call Aria
          </a>
        </div>
      </nav>

      {/* ─── 1. HERO ─────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "100px 24px 60px",
        }}
      >
        <p
          className="meta hero-animate"
          style={{ marginBottom: "28px", letterSpacing: "0.08em" }}
        >
          For HVAC &amp; trades shops &middot; Kitchener-Waterloo
        </p>

        <h1
          className="hero-animate"
          style={{
            fontFamily: "var(--display)",
            fontSize: "clamp(36px, 7vw, 76px)",
            fontWeight: 700,
            lineHeight: 1.06,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            maxWidth: "820px",
            marginBottom: "24px",
            animationDelay: "0.1s",
          }}
        >
          Your phone rings. You&rsquo;re under a furnace.{" "}
          <span style={{ color: "var(--orange)" }}>We&nbsp;answer.</span>
        </h1>

        <p
          className="hero-animate"
          style={{
            fontSize: "clamp(16px, 1.8vw, 20px)",
            lineHeight: 1.6,
            color: "var(--text-body)",
            maxWidth: "600px",
            marginBottom: "44px",
            animationDelay: "0.2s",
          }}
        >
          Verbatim builds and runs the systems a shop can&rsquo;t stop for:
          every call answered and booked, every happy customer turned into a
          five-star review, every lead followed up until it&rsquo;s a job on
          your calendar.
        </p>

        {/* Primary CTA — phone */}
        <div
          className="hero-animate"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            animationDelay: "0.32s",
          }}
        >
          <MagneticButton
            href={`tel:${PHONE}`}
            style={{
              gap: "10px",
              padding: "18px 36px",
              background: "var(--orange)",
              color: "#fff",
              borderRadius: "14px",
              fontWeight: 600,
              fontSize: "clamp(16px, 1.6vw, 19px)",
              letterSpacing: "-0.01em",
              boxShadow:
                "0 0 40px rgba(255,120,73,0.25), 0 4px 16px rgba(0,0,0,0.3)",
            }}
            subcaption="She's answering right now."
          >
            <span aria-hidden style={{ fontSize: "20px" }}>
              📞
            </span>
            Call Aria now&nbsp;&mdash;&nbsp;{PHONE_DISPLAY}
          </MagneticButton>

          {/* Secondary CTA — demo */}
          <a
            href={DEMO_LINK}
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--text-soft)",
              textDecoration: "none",
              padding: "10px 24px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              transition: "border-color 0.2s ease, color 0.2s ease",
            }}
          >
            Watch the 90-second demo&nbsp;&rarr;
          </a>
        </div>
      </section>

      {/* ─── 2. STAT STRIP ───────────────────────────────────────────── */}
      <FadeIn stagger>
        <section
          style={{
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-elevated)",
            padding: "clamp(48px, 6vw, 80px) 24px",
          }}
        >
          <div
            style={{
              maxWidth: "var(--max)",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "40px",
              textAlign: "center",
            }}
          >
            {/* Stat 1 */}
            <div>
              <p
                style={{
                  fontFamily: "var(--display)",
                  fontSize: "clamp(40px, 5vw, 60px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "var(--text)",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                <StatCounter value={27} suffix="%" />
              </p>
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--text-body)",
                  lineHeight: 1.5,
                }}
              >
                of calls to home-service shops ring out unanswered
              </p>
            </div>
            {/* Stat 2 */}
            <div>
              <p
                style={{
                  fontFamily: "var(--display)",
                  fontSize: "clamp(40px, 5vw, 60px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "var(--text)",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                <StatCounter value={85} suffix="%" />
              </p>
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--text-body)",
                  lineHeight: 1.5,
                }}
              >
                of callers won&rsquo;t leave a voicemail&nbsp;&mdash; they dial
                the next shop
              </p>
            </div>
            {/* Stat 3 */}
            <div>
              <p
                style={{
                  fontFamily: "var(--display)",
                  fontSize: "clamp(40px, 5vw, 60px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "var(--text)",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                <StatCounter value={1200} prefix="$" format />
              </p>
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--text-body)",
                  lineHeight: 1.5,
                }}
              >
                walks out the door with every missed repair call
              </p>
            </div>
          </div>
          <p
            style={{
              textAlign: "center",
              marginTop: "36px",
              fontSize: "clamp(16px, 1.6vw, 19px)",
              fontWeight: 500,
              color: "var(--text)",
              letterSpacing: "-0.01em",
            }}
          >
            Every missed call is a booked job&nbsp;&mdash; for someone else.
          </p>
        </section>
      </FadeIn>

      {/* ─── 3. PRODUCTS — 3D tilt cards ─────────────────────────────── */}
      <FadeIn stagger>
        <section
          style={{
            padding: `${SECTION_PY} 24px`,
            maxWidth: "var(--max)",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {/* Card 01 — Aria */}
            <TiltCard>
              <p
                className="meta"
                style={{ color: "var(--orange)", marginBottom: "16px" }}
              >
                01
              </p>
              <h3
                style={{
                  fontFamily: "var(--display)",
                  fontSize: "28px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  marginBottom: "6px",
                }}
              >
                Aria
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  color: "var(--text-soft)",
                  marginBottom: "20px",
                  fontWeight: 500,
                }}
              >
                The receptionist who never sleeps.
              </p>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <Bullet>
                  Picks up in two rings&nbsp;&mdash; the 2&nbsp;a.m. gas leak
                  and the 2&nbsp;p.m. quote call
                </Bullet>
                <Bullet>
                  Books the job into your calendar while you&rsquo;re still on
                  the ladder
                </Bullet>
                <Bullet>
                  Texts the customer their confirmation before they can dial
                  anyone else
                </Bullet>
                <Bullet>
                  Flags real emergencies to your cell in seconds&nbsp;&mdash;
                  and only real ones
                </Bullet>
              </ul>
            </TiltCard>

            {/* Card 02 — Google Review Agent */}
            <TiltCard>
              <p
                className="meta"
                style={{ color: "var(--orange)", marginBottom: "16px" }}
              >
                02
              </p>
              <h3
                style={{
                  fontFamily: "var(--display)",
                  fontSize: "28px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  marginBottom: "6px",
                }}
              >
                Google Review Agent
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  color: "var(--text-soft)",
                  marginBottom: "20px",
                  fontWeight: 500,
                }}
              >
                The five stars you&rsquo;ve already earned.
              </p>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <Bullet>
                  Asks for the review right after the job, while the
                  customer&rsquo;s still happy
                </Bullet>
                <Bullet>
                  One tap from their text to your Google profile&nbsp;&mdash; no
                  logins, no friction
                </Bullet>
                <Bullet>
                  Replies to every review in your voice, the good ones and the
                  hard ones
                </Bullet>
                <Bullet>
                  Turns years of quiet good work into the proof new customers
                  search for
                </Bullet>
              </ul>
            </TiltCard>

            {/* Card 03 — Lead Gen */}
            <TiltCard>
              <p
                className="meta"
                style={{ color: "var(--orange)", marginBottom: "16px" }}
              >
                03
              </p>
              <h3
                style={{
                  fontFamily: "var(--display)",
                  fontSize: "28px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  marginBottom: "6px",
                }}
              >
                Lead Gen &amp; Website Systems
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  color: "var(--text-soft)",
                  marginBottom: "20px",
                  fontWeight: 500,
                }}
              >
                From first click to booked job.
              </p>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <Bullet>
                  A website built to book work, not sit there looking pretty
                </Bullet>
                <Bullet>
                  Every lead followed up in minutes&nbsp;&mdash; not after
                  you&rsquo;re home and showered
                </Bullet>
                <Bullet>
                  Qualified and sorted, so your time only goes to real jobs
                </Bullet>
                <Bullet>
                  Built and run for you&nbsp;&mdash; nothing new to learn,
                  nothing to babysit
                </Bullet>
              </ul>
            </TiltCard>
          </div>
        </section>
      </FadeIn>

      {/* ─── 4. HOW IT WORKS ─────────────────────────────────────────── */}
      <FadeIn stagger>
        <section
          style={{
            padding: `${SECTION_PY} 24px`,
            maxWidth: "var(--max)",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--display)",
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              textAlign: "center",
              marginBottom: "clamp(40px, 5vw, 64px)",
            }}
          >
            How it works
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "32px",
            }}
          >
            {/* Step 1 */}
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "var(--display)",
                  fontSize: "48px",
                  fontWeight: 700,
                  color: "var(--orange)",
                  lineHeight: 1,
                  marginBottom: "16px",
                  letterSpacing: "-0.03em",
                }}
              >
                01
              </p>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  marginBottom: "10px",
                }}
              >
                Start with one call
              </h3>
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--text-body)",
                  lineHeight: 1.6,
                  maxWidth: "320px",
                  margin: "0 auto",
                }}
              >
                Dial{" "}
                <a
                  href={`tel:${PHONE}`}
                  style={{ color: "var(--orange)", textDecoration: "none" }}
                >
                  {PHONE_DISPLAY}
                </a>{" "}
                and hear Aria yourself, or book ten&nbsp;minutes with Dhanush.
              </p>
            </div>
            {/* Step 2 */}
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "var(--display)",
                  fontSize: "48px",
                  fontWeight: 700,
                  color: "var(--orange)",
                  lineHeight: 1,
                  marginBottom: "16px",
                  letterSpacing: "-0.03em",
                }}
              >
                02
              </p>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  marginBottom: "10px",
                }}
              >
                We build it around your business
              </h3>
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--text-body)",
                  lineHeight: 1.6,
                  maxWidth: "320px",
                  margin: "0 auto",
                }}
              >
                Your hours, your service area, your calendar. Live in days,
                not months.
              </p>
            </div>
            {/* Step 3 */}
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "var(--display)",
                  fontSize: "48px",
                  fontWeight: 700,
                  color: "var(--orange)",
                  lineHeight: 1,
                  marginBottom: "16px",
                  letterSpacing: "-0.03em",
                }}
              >
                03
              </p>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  marginBottom: "10px",
                }}
              >
                It runs
              </h3>
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--text-body)",
                  lineHeight: 1.6,
                  maxWidth: "320px",
                  margin: "0 auto",
                }}
              >
                Jobs land on your calendar. Emergencies hit your phone. A
                report lands every month.
              </p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ─── 5. ROI BLOCK ────────────────────────────────────────────── */}
      <FadeIn stagger>
        <section
          style={{
            padding: `${SECTION_PY} 24px`,
            maxWidth: "780px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--display)",
              fontSize: "clamp(26px, 3.5vw, 42px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              marginBottom: "28px",
            }}
          >
            The math a shop owner actually cares about.
          </h2>
          <p
            style={{
              fontSize: "clamp(17px, 1.8vw, 20px)",
              lineHeight: 1.65,
              color: "var(--text-body)",
            }}
          >
            Aria runs{" "}
            <span
              style={{
                color: "var(--text)",
                fontWeight: 600,
                fontSize: "1.15em",
              }}
            >
              $1,500&nbsp;a&nbsp;month
            </span>
            . Your average repair call is worth about{" "}
            <span
              style={{
                color: "var(--text)",
                fontWeight: 600,
                fontSize: "1.15em",
              }}
            >
              $1,200
            </span>
            . One recovered call covers most of the month. Two make it
            profitable. Most shops are missing{" "}
            <span style={{ color: "var(--orange)", fontWeight: 600 }}>ten</span>.
          </p>
        </section>
      </FadeIn>

      {/* ─── 6. WHY VERBATIM ─────────────────────────────────────────── */}
      <FadeIn stagger>
        <section
          style={{
            padding: `${SECTION_PY} 24px`,
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              maxWidth: "720px",
              margin: "0 auto",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--display)",
                fontSize: "clamp(24px, 3vw, 38px)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                marginBottom: "36px",
                textAlign: "center",
              }}
            >
              Built in Kitchener, for shops the big platforms ignore.
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "28px",
              }}
            >
              <p
                style={{
                  fontSize: "clamp(16px, 1.6vw, 18px)",
                  lineHeight: 1.65,
                  color: "var(--text-body)",
                }}
              >
                The enterprise platforms start at $50K a year and won&rsquo;t
                return a small shop&rsquo;s call. We built for that shop
                instead.
              </p>
              <p
                style={{
                  fontSize: "clamp(16px, 1.6vw, 18px)",
                  lineHeight: 1.65,
                  color: "var(--text-body)",
                }}
              >
                Designed and run by an AI developer with a Master&rsquo;s from
                Laurier. One builder, accountable to you&nbsp;&mdash; you call
                Dhanush, not a support queue.
              </p>
              <p
                style={{
                  fontSize: "clamp(16px, 1.6vw, 18px)",
                  lineHeight: 1.65,
                  color: "var(--text-body)",
                }}
              >
                Done for you means done: we build it, run it, tune it, and
                report on it. You do the work you&rsquo;re good at.
              </p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ─── 7. FINAL CTA ────────────────────────────────────────────── */}
      <FadeIn stagger>
        <section
          style={{
            padding: `${SECTION_PY} 24px`,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--display)",
              fontSize: "clamp(26px, 3.5vw, 44px)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              marginBottom: "32px",
            }}
          >
            Hear it for yourself.
          </h2>

          <a
            href={`tel:${PHONE}`}
            style={{
              display: "inline-block",
              fontFamily: "var(--display)",
              fontSize: "clamp(36px, 6vw, 72px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--orange)",
              textDecoration: "none",
              lineHeight: 1.1,
              marginBottom: "28px",
              transition: "opacity 0.2s ease",
            }}
          >
            {PHONE_DISPLAY}
          </a>

          <p
            style={{
              fontSize: "15px",
              color: "var(--text-body)",
              lineHeight: 1.6,
              maxWidth: "480px",
              margin: "0 auto",
            }}
          >
            Or reach Dhanush directly&nbsp;&mdash;{" "}
            <a
              href="mailto:dhanush@joinverbatim.com"
              style={{ color: "var(--blue)", textDecoration: "none" }}
            >
              dhanush@joinverbatim.com
            </a>
            <br />
            <a
              href={DEMO_LINK}
              style={{
                color: "var(--text-soft)",
                textDecoration: "none",
                marginTop: "8px",
                display: "inline-block",
              }}
            >
              Watch the 90-second demo&nbsp;&rarr;
            </a>
          </p>
        </section>
      </FadeIn>

      {/* ─── 8. FOOTER ───────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "28px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "var(--max)",
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
            fontFamily: "var(--mono)",
            fontSize: "12px",
            color: "var(--text-faint)",
          }}
        >
          <span>Verbatim AI Agency &middot; Kitchener, Ontario</span>
          <span>&middot;</span>
          <Link
            href="/privacy"
            style={{ color: "var(--text-soft)", textDecoration: "none" }}
          >
            Privacy
          </Link>
          <span>&middot;</span>
          <Link
            href="/terms"
            style={{ color: "var(--text-soft)", textDecoration: "none" }}
          >
            Terms
          </Link>
          <span>&middot;</span>
          <Link
            href="/sms"
            style={{ color: "var(--text-soft)", textDecoration: "none" }}
          >
            SMS Policy
          </Link>
        </div>
      </footer>
    </>
  );
}
