"use client";

import { useEffect } from "react";
import { siteConfig } from "@/config/site.config";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  isHomePage?: boolean;
}

function setMeta(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setOg(property: string, content: string) {
  let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export default function SEO({
  title,
  description,
  path = "",
  image,
  isHomePage = false,
}: SEOProps) {
  useEffect(() => {
    const seoTitle = title
      ? title
      : isHomePage
        ? `${siteConfig.name} | ${siteConfig.tagline}`
        : siteConfig.name;

    const seoDescription = description || siteConfig.description;
    const seoImage = image || siteConfig.ogImage;
    const url = `${siteConfig.url}${path}`;

    document.title = seoTitle;
    setMeta("description", seoDescription);
    setMeta("keywords", siteConfig.keywords.join(", "));
    setMeta("author", siteConfig.organization.name);

    setOg("og:type", siteConfig.type);
    setOg("og:locale", siteConfig.locale);
    setOg("og:url", url);
    setOg("og:site_name", siteConfig.name);
    setOg("og:title", seoTitle);
    setOg("og:description", seoDescription);
    setOg("og:image", seoImage);
  }, [title, description, path, image, isHomePage]);

  return null;
}

