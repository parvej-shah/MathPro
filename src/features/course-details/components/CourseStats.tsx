import { isSectionValid } from "@/features/course-details/_lib/utils";
import { Section } from "@/features/course-details/_lib/types";

interface CourseStatsProps {
  sections?: {
    chapter?: Section;
    video?: Section;
    contest?: Section;
    liveClass?: Section;
    archiveClass?: Section;
    codingProblem?: Section;
  };
}

export default function CourseStats({ sections }: CourseStatsProps) {
  if (!sections) return null;

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-y-3 gap-x-3">
      {isSectionValid(sections.chapter) && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 dark:bg-white/5">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.75 0.5C1.95507 0.5 0.5 1.95508 0.5 3.75V14.25C0.5 16.0449 1.95507 17.5 3.75 17.5H13.25C15.0449 17.5 16.5 16.0449 16.5 14.25V3.75C16.5 1.95507 15.0449 0.5 13.25 0.5H3.75ZM21.6232 15.6431L18 12.0935V5.99889L21.6121 2.3706C22.3988 1.58044 23.748 2.13753 23.748 3.25251V14.7502C23.748 15.8577 22.4143 16.4181 21.6232 15.6431Z"
              fill="#D95344"
            />
          </svg>
          <div>
            <p className="text-paragraph dark:text-darkParagraph text-xl">
              {sections.chapter?.label}
            </p>
            <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
              {sections.chapter?.value}
            </p>
          </div>
        </div>
      )}

      {isSectionValid(sections.video) && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 dark:bg-white/5">
          <svg
            width="24"
            height="18"
            viewBox="0 0 24 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.75 0.5C1.95507 0.5 0.5 1.95508 0.5 3.75V14.25C0.5 16.0449 1.95507 17.5 3.75 17.5H13.25C15.0449 17.5 16.5 16.0449 16.5 14.25V3.75C16.5 1.95507 15.0449 0.5 13.25 0.5H3.75ZM21.6232 15.6431L18 12.0935V5.99889L21.6121 2.3706C22.3988 1.58044 23.748 2.13753 23.748 3.25251V14.7502C23.748 15.8577 22.4143 16.4181 21.6232 15.6431Z"
              fill="#B2F100"
            />
          </svg>
          <div>
            <p className="text-paragraph dark:text-darkParagraph text-xl">
              {sections.video?.label}
            </p>
            <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
              {sections.video?.value}
            </p>
          </div>
        </div>
      )}

      {isSectionValid(sections.contest) && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 dark:bg-white/5">
          <svg
            width="22"
            height="24"
            viewBox="0 0 22 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 2.75C4 1.23122 5.23122 0 6.75 0H14.75C16.2688 0 17.5 1.23122 17.5 2.75V3H19.75C20.7165 3 21.5 3.7835 21.5 4.75V7.75C21.5 10.0902 19.6085 11.9887 17.271 11.9999C16.5627 14.6458 14.2871 16.6507 11.5 16.9588V19H14.25C16.0449 19 17.5 20.4551 17.5 22.25V22.75C17.5 23.4404 16.9404 24 16.25 24H5.25C4.55964 24 4 23.4404 4 22.75V22.25C4 20.4551 5.45507 19 7.25 19H10V16.9588C7.21294 16.6507 4.93729 14.6458 4.22905 11.9999C1.89148 11.9887 0 10.0902 0 7.75V4.75C0 3.7835 0.783502 3 1.75 3H4V2.75ZM4 4.5H1.75C1.61193 4.5 1.5 4.61193 1.5 4.75V7.75C1.5 9.18593 2.60055 10.3648 4.00416 10.4892C4.00139 10.4098 4 10.3301 4 10.25V4.5ZM17.4958 10.4892C18.8995 10.3648 20 9.18593 20 7.75V4.75C20 4.61193 19.8881 4.5 19.75 4.5H17.5V10.25C17.5 10.3301 17.4986 10.4098 17.4958 10.4892Z"
              fill="#FFA500"
            />
          </svg>
          <div>
            <div>
              <p className="text-paragraph dark:text-darkParagraph text-xl">
                {sections.contest?.label}
              </p>
              <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                {sections.contest?.value}
              </p>
            </div>
          </div>
        </div>
      )}

      {isSectionValid(sections.liveClass) && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 dark:bg-white/5">
          <svg
            width="25"
            height="18"
            viewBox="0 0 25 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.89992 0.761631C6.35553 1.21724 6.35553 1.95593 5.89992 2.41155C2.25385 6.05761 2.25385 11.9691 5.89992 15.6151C6.35553 16.0707 6.35553 16.8094 5.89992 17.265C5.4443 17.7207 4.70561 17.7207 4.25 17.265C-0.307292 12.7078 -0.307292 5.31892 4.25 0.761631C4.70561 0.306019 5.4443 0.306019 5.89992 0.761631ZM20.7534 0.761631C25.3107 5.31892 25.3107 12.7078 20.7534 17.265C20.2978 17.7207 19.5591 17.7207 19.1035 17.265C18.6479 16.8094 18.6479 16.0707 19.1035 15.6151C22.7496 11.9691 22.7496 6.05761 19.1035 2.41155C18.6479 1.95593 18.6479 1.21724 19.1035 0.761631C19.5591 0.306019 20.2978 0.306019 20.7534 0.761631ZM9.36101 4.1139C9.81662 4.56951 9.81662 5.30821 9.36101 5.76382C7.57488 7.54994 7.57488 10.4458 9.36101 12.2319C9.81662 12.6876 9.81662 13.4262 9.36101 13.8819C8.9054 14.3375 8.1667 14.3375 7.71109 13.8819C5.01374 11.1845 5.01374 6.81125 7.71109 4.1139C8.1667 3.65829 8.9054 3.65829 9.36101 4.1139ZM17.479 4.1139C20.1764 6.81125 20.1764 11.1845 17.479 13.8819C17.0234 14.3375 16.2847 14.3375 15.8291 13.8819C15.3735 13.4262 15.3735 12.6876 15.8291 12.2319C17.6153 10.4458 17.6153 7.54994 15.8291 5.76382C15.3735 5.30821 15.3735 4.56951 15.8291 4.1139C16.2847 3.65829 17.0234 3.65829 17.479 4.1139ZM12.5951 7.3449C13.5616 7.3449 14.3451 8.1284 14.3451 9.0949C14.3451 10.0614 13.5616 10.8449 12.5951 10.8449C11.6286 10.8449 10.8451 10.0614 10.8451 9.0949C10.8451 8.1284 11.6286 7.3449 12.5951 7.3449Z"
              fill="#EE4878"
            />
          </svg>
          <div>
            <p className="text-paragraph dark:text-darkParagraph text-xl">
              {sections.liveClass?.label}
            </p>
            <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
              {sections.liveClass?.value}
            </p>
          </div>
        </div>
      )}

      {isSectionValid(sections.archiveClass) && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 dark:bg-white/5">
          <svg
            width="19"
            height="24"
            viewBox="0 0 19 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.6254 0.333611C17.3974 0.333611 18.8338 1.77003 18.8338 3.54194V20.4566C18.8338 22.2285 17.3974 23.6649 15.6254 23.6649H3.37533C1.60341 23.6649 0.166992 22.2285 0.166992 20.4566V3.54194C0.166992 1.77003 1.60341 0.333611 3.37533 0.333611L3.71532 0.333008V9.86135C3.71532 10.7341 4.63742 11.0444 5.25366 10.7239L5.35899 10.6608L7.80079 9.26397L10.298 10.6982C10.8177 11.0578 11.7686 10.8159 11.8727 10.0095L11.882 9.86135V0.333008L15.6254 0.333611ZM10.132 0.333008V8.58799L8.24012 7.50077C7.97558 7.37416 7.61582 7.37704 7.31518 7.52704L7.19041 7.60039L5.46532 8.58719V0.333008H10.132Z"
              fill="#B153E0"
            />
          </svg>
          <div>
            <div>
              <p className="text-paragraph dark:text-darkParagraph text-xl">
                {sections.archiveClass?.label}
              </p>
              <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                {sections.archiveClass?.value}
              </p>
            </div>
          </div>
        </div>
      )}

      {isSectionValid(sections.codingProblem) && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 dark:bg-white/5">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"
              fill="#FFA500"
            />
          </svg>
          <div>
            <p className="text-paragraph dark:text-darkParagraph text-xl">
              {sections.codingProblem?.label}
            </p>
            <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
              {sections.codingProblem?.value}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
