"use client"
import { useState } from "react";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md';

export interface FAQ {
    question: string;
    answer: string;
  }

export const faqs: FAQ[] = [
  {
    question: "How do I use stock videos?",
    answer: "Stock video is widely used in today's media and entertainment industries. It helps save both money and valuable production resources. From news stories and big-budget movies to commercials and documentaries, stock video can be used in various visual mediums. Whether you need archival footage, cost-effective special effects, or establishing shots, there are different types of stock video available.",
  },
  {
    question: "What is the best format for stock footage?",
    answer: "The best format for stock footage is typically high resolution, such as 4K or HD, in a common format like MP4.",
  },
  {
    question: "How can I find stock footage for television?",
    answer: "You can find stock footage for television by searching through stock footage websites and filtering for broadcast-quality clips.",
  },
  {
    question: "What usage is permitted with the Shutterstock stock video license?",
    answer: "The Shutterstock stock video license permits use in various projects including commercials, films, and online videos, but with specific restrictions.",
  },
  {
    question: "Are stock videos copyright free?",
    answer: "No, stock videos are not copyright-free. They are licensed for use under specific terms and conditions.",
  },
  {
    question: "Can I use stock footage on YouTube?",
    answer: "Yes, you can use stock footage on YouTube, provided you have the proper license for the footage.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl  rounded-lg  lg:p-8">
      {faqs.map((faq: FAQ, index: number) => (
        <div key={index} className="border-b border-gray-300">
          <div
            onClick={() => toggleAccordion(index)}
            className="cursor-pointer  py-2 hover:bg-gray-200 flex justify-between items-center"
          >
            <span className="flex items-center text-gray-800">{faq.question}</span>
            <button className="focus:outline-none">
              {activeIndex === index ? (
                <MdOutlineKeyboardArrowUp className="h-6 w-6 text-gray-500" />
              ) : (
                <MdOutlineKeyboardArrowDown className="h-6 w-6 text-gray-500" />
              )}
            </button>
          </div>
          {activeIndex === index && (
            <div className="pl-8 pr-4 py-2">
              <p>{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
