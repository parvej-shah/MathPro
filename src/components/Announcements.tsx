import React from "react";
import { SafeHtmlRenderer } from "./SafeHtmlRenderer";

interface Announcement {
  id: string;
  title: string;
  content: string;
}

interface AnnouncementsProps {
  announcements?: Announcement[];
}

const Announcements: React.FC<AnnouncementsProps> = ({
  announcements = [],
}) => {
  if (announcements.length === 0) {
    return (
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-heading dark:text-darkHeading">
          Announcements
        </h3>
        <p className="text-paragraph dark:text-darkParagraph">
          Announcements coming soon
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-muted rounded-lg">
      <h3 className="text-lg font-semibold mb-2 text-heading dark:text-darkHeading">
        Announcements
      </h3>
      {announcements.map((ann) => (
        <div key={ann.id} className="mb-4">
          <h4 className="font-medium text-heading dark:text-darkHeading">
            {ann.title}
          </h4>
          <SafeHtmlRenderer
            content={ann.content}
            className="text-paragraph dark:text-darkParagraph"
          />
        </div>
      ))}
    </div>
  );
};

export default Announcements;
