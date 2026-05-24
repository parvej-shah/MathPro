import { AnimationOnScroll } from "react-animation-on-scroll";
import { motion } from "framer-motion";

interface QuestionsContactSectionProps {
  className?: string;
  disableBackground?: boolean;
}

const contactChannels = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    label: "WhatsApp",
    href: "https://wa.me/8801768976036?text=আমি CSE Fundamentals কোর্স সম্পর্কে জানতে চাই",
    icon: (
      <svg
        className="w-6 h-6 text-green"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    ),
    color: "#25D366",
  },
  {
    id: "messenger",
    name: "Messenger",
    label: "Messenger",
    href: "https://m.me/codervaibd",
    icon: (
      <svg
        className="w-6 h-6 text-blue"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z" />
      </svg>
    ),
    color: "#0084FF",
  },
  {
    id: "phone",
    name: "Phone",
    label: "ফোন করো",
    href: "tel:+8801768976036",
    icon: (
      <svg
        className="w-6 h-6 text-purple"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
    color: "#8b5cf6",
  },
  {
    id: "email",
    name: "Email",
    label: "ইমেইল করো",
    href: "mailto:support@codervai.com?subject=CSE Fundamentals কোর্স সম্পর্কে জানতে চাই",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    color: "#8b5cf6",
  },
];

export default function QuestionsContactSection({
  className = "",
  disableBackground = false,
}: QuestionsContactSectionProps) {
  const handleContactClick = (channel: string, href: string) => {
    // Analytics tracking for CRO
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "contact_click", {
        contact_channel: channel,
        event_category: "engagement",
        event_label: "questions_section",
      });
    }

    // Open link
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      className={`relative w-[80%] mx-auto py-12 md:py-16 lg:py-20 ${className}`}
      aria-labelledby="questions-heading"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
        <AnimationOnScroll animateIn="animate__fadeIn" animateOnce>
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* Left Section: Question & Reassurance */}
            <div className="flex-1 w-full lg:w-auto text-center lg:text-left">
              {/* Call/Help Icon */}
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full mb-6 lg:mb-8 mx-auto lg:mx-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(192, 132, 252, 0.2) 100%)",
                  border: "2px solid rgba(139, 92, 246, 0.4)",
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-[#8b5cf6]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </motion.div>

              {/* Main Question - SEO Optimized H2 */}
              <h2
                id="questions-heading"
                className="text-2xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight"
              >
                এখনো <span className="text-[#6046EC]">প্রশ্ন</span> রয়েছে?
              </h2>

              {/* Reassurance Text */}
              <p className="text-base md:text-lg text-foreground leading-relaxed mb-8 lg:mb-0">
                চিন্তা নেই! আমরা ২৪/৭ তোমার পাশে আছি!
              </p>

              {/* Visually Hidden SEO Text */}
              <p className="sr-only">
                Contact CoderVai support team via WhatsApp, Messenger, Phone, or
                Email for questions about CSE Fundamentals Graduation Program
              </p>
            </div>

            {/* Right Section: Contact Channels */}
            <div className="flex-1 w-full lg:w-auto flex flex-col gap-4 md:gap-5">
              {contactChannels.map((channel, index) => (
                <motion.a
                  key={channel.id}
                  href={channel.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleContactClick(channel.id, channel.href);
                  }}
                  className="group relative flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "rgba(0, 0, 0, 0.02)",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `rgba(${
                      channel.id === "whatsapp"
                        ? "37, 211, 102"
                        : channel.id === "messenger"
                          ? "0, 132, 255"
                          : "139, 92, 246"
                    }, 0.1)`;
                    e.currentTarget.style.borderColor = `rgba(${
                      channel.id === "whatsapp"
                        ? "37, 211, 102"
                        : channel.id === "messenger"
                          ? "0, 132, 255"
                          : "139, 92, 246"
                    }, 0.4)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(0, 0, 0, 0.02)";
                    e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.1)";
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  aria-label={`Contact us via ${channel.name}`}
                >
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{ color: channel.color }}
                  >
                    {channel.icon}
                  </div>

                  {/* Label */}
                  <span className="text-foreground font-medium text-base md:text-lg flex-1 text-left">
                    {channel.label}
                  </span>

                  {/* Arrow Icon */}
                  <svg
                    className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>
        </AnimationOnScroll>
      </div>
    </section>
  );
}
