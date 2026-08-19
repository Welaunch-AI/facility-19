"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/roi-dashboard/ui/accordion";
import {
  faqHeadingText,
  faqQuestionText,
  headingAnchorId,
  NotionBlocks,
  type FaqItem,
} from "@/components/blog/notion-blocks";
import type { BlogBlock } from "@/lib/notion";

type BlogFaqProps = {
  heading: BlogBlock;
  items: FaqItem[];
};

export function BlogFaq({ heading, items }: BlogFaqProps) {
  if (!items.length) return null;

  const title = faqHeadingText(heading);

  return (
    <section id={headingAnchorId(heading)} className="mt-14">
      <h2 className="text-2xl font-semibold tracking-tight text-ink">{title}</h2>
      <div className="card-soft mt-5 px-6 py-2">
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, index) => (
            <AccordionItem
              key={item.question.id}
              value={`faq-item-${index + 1}`}
              className="border-line"
            >
              <AccordionTrigger className="py-5 text-left text-[17px] font-medium text-ink hover:no-underline">
                {faqQuestionText(item)}
              </AccordionTrigger>
              <AccordionContent className="pb-5 pt-0">
                <div className="prose-blog max-w-none">
                  <NotionBlocks blocks={item.answer} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
