import Image from "next/image";
import Link from "next/link";
import { BsBoxArrowUpRight } from "react-icons/bs";

interface Socials {
  facebook_community?: string;
  facebook_private_group?: string;
  facebook_page?: string;
  whatsapp?: string;
  messenger?: string;
  phone?: string;
  email?: string;
}

interface CommunitySupportSectionProps {
  socials?: Socials;
  facebookCommunityThumb?: string;
}

export default function CommunitySupportSection({
  socials,
  facebookCommunityThumb,
}: CommunitySupportSectionProps) {
  // Don't render if no socials provided
  if (!socials) return null;

  return (
    <div className="pt-12 border-t border-border/20 mt-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          এখনো <span className="text-primary">প্রশ্ন</span> রয়েছে?
        </h2>
        <p className="text-base text-muted-foreground">
          চিন্তা নেই! আমরা ২৪/৭ তোমার পাশে আছি!
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN - Facebook Community */}
        {(socials.facebook_community || facebookCommunityThumb) && (
          <div className="bg-background/70 backdrop-blur-lg rounded-xl shadow-md border border-border/50 p-5 lg:p-6">
            {/* Community Screenshot */}
            <div className="relative aspect-video rounded-lg overflow-hidden mb-4 shadow-sm">
              {facebookCommunityThumb ? (
                <Image
                  src={facebookCommunityThumb}
                  alt="CODER VAI Community"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <Image
                    src="/codervai_community_crop.png"
                    alt="CODER VAI Community"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Community Name */}
            <h3 className="text-xl font-bold text-foreground mb-2 text-center">
              CODER VAI Community
            </h3>

            {/* Why Join */}
            <p className="text-sm text-muted-foreground text-center mb-4 leading-relaxed">
              তুমি হতে পারো কোডার, গবেষক, কিংবা একজন লিডার - দিনশেষে আমরা সবাই
              প্রবলেম সলভার! কানেক্ট করো যারা গতানুগতিকতার বাইরে ভাবে, শেয়ার করো
              তোমার ভিশন, প্রজেক্ট বা রিসার্চ। চলো একসাথে ইমপ্যাক্টফুল কিছু তৈরি
              করি! 🌐
            </p>

            {/* Join Button */}
            {socials.facebook_community && (
              <Link href={socials.facebook_community} target="_blank">
                <button className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-info hover:bg-info/90 text-white rounded-lg font-semibold text-base transition-colors shadow-md hover:shadow-lg">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook গ্রুপে জয়েন করো
                </button>
              </Link>
            )}
          </div>
        )}

        {/* RIGHT COLUMN - Support */}
        <div className="bg-background/70 backdrop-blur-lg rounded-xl shadow-md border border-border/50 p-5 lg:p-6">
          <h3 className="text-xl font-bold text-foreground mb-2 text-center">
            সাপোর্ট দরকার?
          </h3>

          <p className="text-sm text-muted-foreground text-center mb-4">
            কোন কনফিউশন বা প্রশ্ন থাকলে আমাদেরকে কল করো অথবা মেসেজ দাও!
          </p>

          {/* Contact Methods */}
          {/* WhatsApp */}
          {socials.whatsapp && (
            <Link href={socials.whatsapp} target="_blank">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/30 hover:shadow-md transition-shadow cursor-pointer mb-3">
                <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    WhatsApp
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {socials.whatsapp.replace("https://wa.me/", "+")}
                  </p>
                </div>
                <BsBoxArrowUpRight className="text-success" />
              </div>
            </Link>
          )}

          {/* Facebook Messenger */}
          {socials.messenger && (
            <Link href={socials.messenger} target="_blank">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-info/10 border border-info/30 hover:shadow-md transition-shadow cursor-pointer mb-3">
                <div className="w-10 h-10 rounded-full bg-info flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    Facebook Messenger
                  </p>
                  <p className="text-sm text-muted-foreground">
                    সরাসরি মেসেজ দাও
                  </p>
                </div>
                <BsBoxArrowUpRight className="text-info" />
              </div>
            </Link>
          )}

          {/* Facebook Page */}
          {socials.facebook_page && (
            <Link href={socials.facebook_page} target="_blank">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-info/10 border border-info/30 hover:shadow-md transition-shadow cursor-pointer mb-3">
                <div className="w-10 h-10 rounded-full bg-info flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    Facebook Page
                  </p>
                  <p className="text-sm text-muted-foreground">
                    আমাদের পেজ ভিজিট করতে পারো
                  </p>
                </div>
                <BsBoxArrowUpRight className="text-info" />
              </div>
            </Link>
          )}

          {/* Phone */}
          {socials.phone && (
            <Link href={socials.phone}>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/30 hover:shadow-md transition-shadow cursor-pointer mb-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
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
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    Phone
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {socials.phone.replace("tel:", "")}
                  </p>
                </div>
                <BsBoxArrowUpRight className="text-primary" />
              </div>
            </Link>
          )}

          {/* Email */}
          {socials.email && (
            <Link
              href={
                socials.email.startsWith("mailto:")
                  ? socials.email
                  : `mailto:${socials.email}`
              }
            >
              <div className="flex items-center gap-3 p-3 rounded-lg bg-teal/10 border border-teal/30 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    Email
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {socials.email.replace("mailto:", "")}
                  </p>
                </div>
                <BsBoxArrowUpRight className="text-teal" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
