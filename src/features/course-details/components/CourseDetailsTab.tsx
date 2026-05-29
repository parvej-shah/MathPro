import { useState } from "react";
import Slider from "react-slick";
import { Feedback, FAQ } from "@/features/course-details/_lib/types";
import { englishToBanglaNumbers, calculateRemainingDays } from "@/helpers";
import { settings } from "@/features/course-details/_lib/utils";
import { SafeHtmlRenderer } from "@/components/SafeHtmlRenderer";

interface CourseDetailsTabProps {
  description: string;
  feedbacks?: Feedback[];
  faqs?: FAQ[];
  deadline?: string;
  youGet?: string;
}

export default function CourseDetailsTab({
  description,
  feedbacks,
  faqs,
  deadline,
  youGet,
}: CourseDetailsTabProps) {
  const [expandedDescription, setExpandedDescription] = useState(false);

  const youGetItems = youGet ? youGet.split(",").map((s) => s.trim()).filter(Boolean) : [];

  return (
    <div>
      <h2 className="text-2xl lg:text-4xl font-semibold pt-12 border-t border-border/20 relative z-10">
        কোর্স সম্পর্কে বিস্তারিত
      </h2>

      {/* What you get */}
      {youGetItems.length > 0 && (
        <div className="mt-6 mb-8">
          <p className="text-lg font-bold mb-4">এই কোর্সে তুমি পাচ্ছো</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {youGetItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 bg-primary/5 border border-primary/15 rounded-lg px-3 py-2.5 text-sm"
              >
                <svg className="w-4 h-4 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {deadline && (
        <div className="flex gap-8 items-center pb-6 border-b border-border/20 relative z-10">
          <div className="flex gap-3 mt-6 items-center bg-[#FFF1E9]/20 px-3 py-2 rounded-xl">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.99855 17.6269C4.23361 17.6269 0.371094 13.7645 0.371094 8.99951C0.371094 4.23457 4.23361 0.37207 8.99855 0.37207C13.7635 0.37207 17.6259 4.23457 17.6259 8.99951C17.6259 13.7645 13.7635 17.6269 8.99855 17.6269ZM8.99855 15.9015C10.8291 15.9015 12.5846 15.1743 13.879 13.8799C15.1733 12.5856 15.9005 10.83 15.9005 8.99951C15.9005 7.16901 15.1733 5.41346 13.879 4.1191C12.5846 2.82472 10.8291 2.09756 8.99855 2.09756C7.16803 2.09756 5.4125 2.82472 4.11812 4.1191C2.82376 5.41346 2.09659 7.16901 2.09659 8.99951C2.09659 10.83 2.82376 12.5856 4.11812 13.8799C5.4125 15.1743 7.16803 15.9015 8.99855 15.9015ZM9.8613 8.99951H13.3123V10.725H8.1358V4.68579H9.8613V8.99951Z"
                fill="#F1BA41"
              />
            </svg>
            {englishToBanglaNumbers(calculateRemainingDays(deadline))} দিন বাকি
          </div>
        </div>
      )}
      <div className="my-6 text-muted-foreground text-lg relative z-10">
        <div
          className={`${!expandedDescription && "max-h-[150px] overflow-hidden relative"} transition-all duration-300`}
        >
          <SafeHtmlRenderer
            content={description}
            className="text-muted-foreground"
          />
        </div>
        {description.length > 300 && (
          <button
            onClick={() => setExpandedDescription(!expandedDescription)}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium mt-2 transition-all"
          >
            {expandedDescription ? "সংক্ষিপ্ত করো" : "আরও পড়ো"}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform duration-300 ${expandedDescription ? "rotate-180" : ""}`}
            >
              <path d="M8 12L2 6H14L8 12Z" fill="currentColor" />
            </svg>
          </button>
        )}
      </div>

      {feedbacks && feedbacks.length > 0 && (
        <div className="pt-8 border-t border-border/20 pb-8">
          <p className="text-2xl lg:text-4xl pb-8 font-semibold">
            শিক্ষার্থীরা যা বলছে
          </p>
          <div className="max-w-[80vw] lg:max-w-[40vw] lgXl:max-w-[50vw] mx-auto">
            <Slider {...settings}>
              {feedbacks.map((feedback) => (
                <div
                  className="bg-gray-400/20 dark:bg-muted/10 backdrop-blur-lg rounded-lg p-6"
                  key={feedback.name}
                >
                  <svg
                    width="34"
                    height="23"
                    viewBox="0 0 34 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_25_7047)">
                      <path
                        d="M8.01195 8.3856C8.75922 7.05093 10.1173 5.6158 12.4273 4.24813C13.0727 3.88147 13.4804 3.21413 13.4804 2.51307C13.4804 1.07793 11.9859 0.076932 10.6277 0.677532C6.72055 2.37887 0.166016 6.61753 0.166016 15.3926C0.166016 19.3299 3.39268 22.5001 7.36662 22.5001C11.3405 22.5001 14.6009 19.3299 14.6009 15.3926C14.6009 11.7223 11.7138 8.71927 8.01195 8.3856Z"
                        fill="#F1BA41"
                      />
                    </g>
                    <g clipPath="url(#clip1_25_7047)">
                      <path
                        d="M27.0119 8.3856C27.7592 7.05093 29.1173 5.6158 31.4273 4.24813C32.0727 3.88147 32.4804 3.21413 32.4804 2.51307C32.4804 1.07793 30.9859 0.076932 29.6277 0.677532C25.7205 2.37887 19.166 6.61753 19.166 15.3926C19.166 19.3299 22.3927 22.5001 26.3666 22.5001C30.3405 22.5001 33.6009 19.3299 33.6009 15.3926C33.6009 11.7223 30.7138 8.71927 27.0119 8.3856Z"
                        fill="#F1BA41"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_25_7047">
                        <rect
                          width="15"
                          height="22"
                          fill="white"
                          transform="translate(0 0.5)"
                        />
                      </clipPath>
                      <clipPath id="clip1_25_7047">
                        <rect
                          width="15"
                          height="22"
                          fill="white"
                          transform="translate(19 0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <div className="py-8 text-xl text-muted-foreground">
                    <SafeHtmlRenderer content={feedback.description} />
                  </div>
                  <div className="flex gap-4">
                    <img
                      src={feedback.imageUploadedLink}
                      alt=""
                      className="rounded-full max-w-[50px]"
                    />
                    <div>
                      <p className="text-xl">{feedback.name}</p>
                      <p className="text-muted-foreground">
                        {feedback.bio}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}

      <div className="pt-8 border-t border-border/20 relative">
        <svg
          viewBox="0 0 852 1192"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute -top-[200px] -left-[200px] h-full"
          style={{ zIndex: "-1" }}
        >
          <g filter="url(#filter0_f_275_7266)">
            <ellipse
              cx="189.598"
              cy="595.691"
              rx="163.368"
              ry="91.9748"
              transform="rotate(-10.6934 189.598 595.691)"
              fill="#DE9931"
              fillOpacity="0.75"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_275_7266"
              x="-471.852"
              y="0.339355"
              width="1322.9"
              height="1190.7"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="250"
                result="effect1_foregroundBlur_275_7266"
              />
            </filter>
          </defs>
        </svg>

        <p className="text-xl lg:text-3xl mb-8 font-semibold">
          সচরাচর জানতে চাওয়া প্রশ্নের উত্তর
        </p>
        {faqs && faqs.length > 0 ? (
          faqs.map((faq, index) => (
            <div
              className="collapse collapse-plus dark:bg-muted/5 bg-muted/20 border-border/50 backdrop-blur-lg border mb-4"
              key={index}
            >
              <input
                type="radio"
                name="my-accordion-4"
                defaultChecked={index === 0}
              />
              <div className="collapse-title text-xl font-medium">
                {faq.question}
              </div>
              <div className="collapse-content">
                <SafeHtmlRenderer content={faq.answer} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              FAQ শীঘ্রই আপডেট করা হবে
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
