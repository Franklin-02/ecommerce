import { siteConfig } from "@/config/site";
import type { ContentPage } from "@/types/content-pages";

const support = `${siteConfig.supportPhone} or ${siteConfig.supportEmail}`;

const helpLinks = [
  { label: "Delivery options", href: "/help/delivery" },
  { label: "Returns & refunds", href: "/help/returns" },
  { label: "Warranty claims", href: "/help/warranty" },
];

const legalLinks = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Accessibility", href: "/legal/accessibility" },
];

const legalNote = "Sample policy text for this prototype. It isn't legal advice and needs review before launch.";

/** Keyed by URL path, without the leading slash. */
export const contentPages: Record<string, ContentPage> = {
  help: {
    eyebrow: "Help centre",
    title: "How can we help?",
    intro: `Most answers are below. For anything else, our team is available in Tamil and English, 7 days a week, on ${support}.`,
    cards: [
      { title: "Delivery options", body: "Speeds, prices and how to track a parcel.", href: "/help/delivery" },
      { title: "Returns & refunds", body: "Send something back free within 30 days.", href: "/help/returns" },
      { title: "Warranty claims", body: "Get a faulty device repaired or replaced.", href: "/help/warranty" },
      { title: "Track your order", body: "See every order and its latest status.", href: "/account/orders" },
    ],
    sections: [],
    faqs: [
      { question: "How do I track my order?", answer: "Sign in and open Orders in your account. Each order shows its current status and a dated timeline, and shipped orders include your delivery estimate." },
      { question: "Can I change or cancel an order?", answer: "You can cancel from the order page while it's pending or processing. Once it has been packed, wait for it to arrive and return it free of charge instead." },
      { question: "Which payment methods do you accept?", answer: "UPI, credit and debit cards, net banking, no-cost EMI on orders over ₹3,000, and cash on delivery. For cash on delivery you can pay the delivery partner in cash or by UPI." },
      { question: "Are your phones unlocked?", answer: "Yes. Every smartphone we sell is dual-SIM, factory unlocked and works on all major Indian networks, including 5G where your operator offers it." },
      { question: "Do you price match?", answer: "We match the advertised price of any authorised Indian retailer on an identical, in-stock item. Contact support before you order with a link to the listing." },
      { question: "Do I get a GST invoice?", answer: "Yes. Every order comes with a GST invoice. All prices on the site already include GST, so nothing is added at checkout. Business customers can add a GSTIN to claim input tax credit." },
      { question: "How do I use a discount code?", answer: "Enter the code in the order summary at checkout. One code can be used per order, and some codes have a minimum spend." },
    ],
  },
  "help/delivery": {
    eyebrow: "Help centre",
    title: "Delivery options",
    intro: "Choose the speed that suits you at checkout. Every order is tracked from our warehouse to your door.",
    sections: [
      {
        heading: "Speeds and prices",
        bullets: [
          `Next-day delivery within Tamil Nadu: ₹99, or free on orders over ₹${siteConfig.freeDeliveryThreshold}. Order by 8pm, Monday to Saturday.`,
          "Standard delivery across India: ₹49, or free on orders over ₹999, arriving in 3–5 business days.",
          "Store pickup from Chennai, Coimbatore, Madurai, Tiruchirappalli or Salem: free, and usually ready within 2 hours.",
        ],
      },
      {
        heading: "Tracking your parcel",
        body: ["Your order page updates as it moves from processing to packed, shipped and delivered. We also send an SMS and email when it leaves our Sriperumbudur warehouse."],
      },
      {
        heading: "If you miss your delivery",
        body: ["The delivery partner tries twice, then holds the parcel at a nearby collection point for 7 days. Items over ₹25,000 need a one-time password at the door, so they can't be left with a neighbour or security desk."],
      },
    ],
    related: helpLinks,
  },
  "help/returns": {
    eyebrow: "Help centre",
    title: "Returns & refunds",
    intro: "Changed your mind? Send it back free within 30 days of delivery, opened or not.",
    sections: [
      {
        heading: "How to return an item",
        bullets: [
          "Open the order in your account, or contact support, to start your return.",
          "Pack the item with its accessories and original box if you still have it.",
          "Drop it at any collection point or Kanishka store using the prepaid label.",
        ],
      },
      {
        heading: "Refund timing",
        body: ["We inspect returns within 2 business days of receiving them. Refunds go back to your original payment method, usually within 5 business days, or to your UPI ID or bank account for cash on delivery orders."],
      },
      {
        heading: "Items we can't take back",
        body: ["For hygiene reasons, in-ear earbuds with the seal broken can only be returned if faulty. Gift cards can't be returned. Any device must be signed out of your accounts and reset first."],
      },
    ],
    related: helpLinks,
  },
  "help/warranty": {
    eyebrow: "Help centre",
    title: "Warranty claims",
    intro: "Every device we sell includes a 2-year warranty, and laptops include 3 years. It covers manufacturing faults at no cost to you.",
    sections: [
      {
        heading: "What's covered",
        bullets: [
          "Hardware faults that aren't caused by damage or misuse, including failures from normal voltage fluctuation.",
          "Batteries that fall below 70% of their rated capacity.",
          "Faulty ports, buttons, speakers and displays.",
        ],
      },
      {
        heading: "What isn't covered",
        body: ["Accidental damage, liquid damage on devices without a water-resistance rating, normal cosmetic wear, and repairs made by unauthorised technicians."],
      },
      {
        heading: "How to make a claim",
        body: [`Contact us on ${support} with your order number and a short description of the fault. We'll troubleshoot with you first, then arrange a free repair or replacement. Most claims finish within 10 business days.`],
      },
    ],
    related: helpLinks,
  },
  stores: {
    eyebrow: "Store finder",
    title: "Visit a Kanishka store",
    intro: "Try before you buy, get set up by an expert, or collect your order in as little as 2 hours.",
    sections: [],
    locations: [
      { name: "Kanishka T. Nagar", address: "42, Usman Road, T. Nagar, Chennai – 600017", phone: "044 5550 1100", hours: "Mon–Sun 10am–9:30pm", services: ["Pickup", "Device setup", "Repairs", "Returns"] },
      { name: "Kanishka Gandhipuram", address: "118, Cross Cut Road, Gandhipuram, Coimbatore – 641012", phone: "0422 555 1200", hours: "Mon–Sun 10am–9:30pm", services: ["Pickup", "Repairs", "Returns"] },
      { name: "Kanishka Anna Nagar", address: "27, Anna Nagar Main Road, Madurai – 625020", phone: "0452 555 1300", hours: "Mon–Sun 10am–9pm", services: ["Pickup", "Device setup", "Recycling"] },
      { name: "Kanishka Thillai Nagar", address: "9, Thillai Nagar Main Road, Tiruchirappalli – 620018", phone: "0431 555 1400", hours: "Mon–Sun 10am–9pm", services: ["Pickup", "Repairs", "Recycling"] },
      { name: "Kanishka Fairlands", address: "61, Omalur Main Road, Salem – 636004", phone: "0427 555 1500", hours: "Mon–Sun 10am–9pm", services: ["Pickup", "Device setup", "Returns"] },
    ],
  },
  about: {
    eyebrow: "About Kanishka",
    title: "Electronics, properly sourced.",
    intro: "We started Kanishka Computer & Mobiles in Chennai because buying a charger shouldn't mean gambling on a counterfeit. We carry a tighter range, test what we sell and stand behind it.",
    sections: [
      {
        heading: "What we believe",
        bullets: [
          "Fewer, better products. Every item is tested by our team before it's listed.",
          "Honest specs. If a battery claim doesn't hold up, the product doesn't make the cut.",
          "Support in Tamil and English from real people who know the products, 7 days a week.",
        ],
      },
      {
        heading: "How we work",
        body: ["We're based in Chennai, and everything ships from our own warehouse in Sriperumbudur, so we control the quality of every order from shelf to doorstep. We buy from brands and authorised distributors only, which means genuine products with full Indian warranties."],
      },
    ],
    related: [
      { label: "Careers", href: "/careers" },
      { label: "Recycle your device", href: "/recycle" },
      { label: "Store finder", href: "/stores" },
    ],
  },
  business: {
    eyebrow: "Business accounts",
    title: "Equip your whole team",
    intro: "Volume pricing, GST invoicing and a named account manager for companies buying 10 or more devices a year.",
    cards: [
      { title: "Volume pricing", body: "Tiered discounts on laptops, phones and accessories, applied automatically." },
      { title: "GST invoices", body: "Claim input tax credit, and pay by invoice on approved credit with 30-day terms." },
      { title: "Device setup", body: "Asset tagging and pre-configuration before devices reach your team." },
    ],
    sections: [
      {
        heading: "How to open an account",
        body: [`Email ${siteConfig.supportEmail} with your company name, GSTIN and expected yearly spend. We usually approve new accounts within 2 business days.`],
      },
    ],
  },
  careers: {
    eyebrow: "Careers",
    title: "Help people buy better technology",
    intro: "We're a small team that cares about getting the details right. Here's who we're looking for at the moment.",
    cards: [
      { title: "Fulfillment Associate", body: "Sriperumbudur Warehouse · Full time. Pick, pack and quality-check customer orders." },
      { title: "Customer Support Specialist", body: "Remote · Full time. Solve product and order questions by phone and chat, in Tamil and English." },
      { title: "Store Technician", body: "Coimbatore · Full time. Handle in-store repairs and device setup." },
      { title: "Senior Category Buyer", body: "Chennai HQ · Full time. Own the audio range and supplier relationships." },
    ],
    sections: [
      {
        heading: "What you get",
        bullets: [
          "Health insurance for you and your family from day one, plus PF and gratuity.",
          "24 days of paid leave, plus Tamil Nadu public holidays including Pongal.",
          "40% staff discount across the store.",
        ],
      },
      {
        heading: "How to apply",
        body: [`Send your CV and the role you're interested in to ${siteConfig.supportEmail}. We reply to every applicant within 10 business days.`],
      },
    ],
  },
  recycle: {
    eyebrow: "Recycle your device",
    title: "Give old tech a second life",
    intro: "Bring us any phone, laptop, tablet or cable, from any brand and in any condition. Recycling is free, and working devices can earn store credit.",
    sections: [
      {
        heading: "How it works",
        bullets: [
          "Back up your data, sign out of your accounts and reset the device.",
          "Drop it at a Kanishka store, or request a free prepaid mailer from support.",
          "We wipe it to industry standards, then refurbish it or send it to a registered recycler, in line with India's E-Waste Management Rules.",
        ],
      },
      {
        heading: "What you can earn",
        body: ["Devices less than 5 years old in working order can qualify for store credit. We'll confirm the value after inspecting the device, and you can have it sent back free if you don't accept."],
      },
    ],
    related: [{ label: "Find a store", href: "/stores" }],
  },
  "gift-cards": {
    eyebrow: "Gift cards",
    title: "The easy gift for anyone with a charger",
    intro: "Digital gift cards arrive by email within minutes and never expire. They work online and in every Kanishka store.",
    cards: [
      { title: "₹500", body: "Covers a case, cable or smart bulb." },
      { title: "₹1,000", body: "Enough for a fast charger or power bank." },
      { title: "₹2,500", body: "Great for earbuds or a portable speaker." },
      { title: "₹5,000", body: "Heads towards headphones or a smartwatch." },
    ],
    sections: [
      {
        heading: "Using a gift card",
        body: ["A great Deepavali or Pongal gift. Enter the code at checkout, and any unused balance stays on the card for next time. Gift cards can't be exchanged for cash or used to buy other gift cards."],
      },
    ],
  },
  "legal/privacy": {
    eyebrow: "Legal",
    title: "Privacy policy",
    intro: "This policy explains what we collect, why we collect it and the choices you have, in line with India's Digital Personal Data Protection Act, 2023.",
    note: legalNote,
    sections: [
      { heading: "What we collect", bullets: ["Account details such as your name, email and phone number.", "Delivery addresses and order history.", "How you use the site, through cookies you've agreed to."] },
      { heading: "How we use it", body: ["We use your information to process orders, provide support, prevent fraud and, if you opt in, send offers. We never sell your personal information."] },
      { heading: "Your choices", body: [`You can update your details in your account, unsubscribe from any email, or ask us to export or delete your data by contacting ${siteConfig.supportEmail}.`] },
    ],
    related: legalLinks,
  },
  "legal/terms": {
    eyebrow: "Legal",
    title: "Terms of use",
    intro: "These terms apply when you use our site or buy from us.",
    note: legalNote,
    sections: [
      { heading: "Orders and pricing", body: ["An order is accepted when we send your shipping confirmation. If a price is shown incorrectly, we'll contact you before dispatch and you can cancel for a full refund."] },
      { heading: "Your account", body: ["Keep your sign-in details secure and tell us if you think someone else has accessed your account."] },
      { heading: "Returns and warranty", body: ["Our return and warranty policies are part of these terms and don't affect your rights under the Consumer Protection Act, 2019."] },
      { heading: "Grievance officer", body: [`As required by the Consumer Protection (E-Commerce) Rules, 2020, complaints can be sent to our grievance officer at ${siteConfig.supportEmail} or ${siteConfig.supportPhone}. We acknowledge complaints within 48 hours and resolve them within a month.`] },
      { heading: "Governing law", body: ["These terms are governed by the laws of India, and disputes fall under the courts of Chennai, Tamil Nadu."] },
    ],
    related: legalLinks,
  },
  "legal/cookies": {
    eyebrow: "Legal",
    title: "Cookie policy",
    intro: "Cookies and similar storage help the site remember you between visits.",
    note: legalNote,
    sections: [
      { heading: "Essential", body: ["These keep you signed in and remember your cart and wishlist. The site can't work properly without them."] },
      { heading: "Analytics", body: ["These show us which pages are useful so we can improve them. They're only used with your consent."] },
      { heading: "Marketing", body: ["These help us show relevant offers on other sites. They're off unless you choose to allow them."] },
    ],
    related: legalLinks,
  },
  "legal/accessibility": {
    eyebrow: "Legal",
    title: "Accessibility statement",
    intro: "We want everyone to be able to shop with us, whatever device or assistive technology they use.",
    note: legalNote,
    sections: [
      { heading: "Our approach", bullets: ["Everything can be used with a keyboard, with visible focus states.", "Status is shown with text as well as colour.", "Animation is reduced when your device asks for it."] },
      { heading: "Tell us what isn't working", body: [`If something is hard to use, contact us on ${support} and we'll help you complete your order and fix the problem.`] },
    ],
    related: legalLinks,
  },
};
