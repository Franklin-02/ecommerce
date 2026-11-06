import { siteConfig } from "@/config/site";

/** Most consumer electronics sit in the 18% GST slab. */
export const GST_RATE = 0.18;

const round = (value: number) => Math.round(value * 100) / 100;

/** Indian selling prices already include GST, so this extracts it rather than adding it. */
export const gstIncludedIn = (amount: number) => round((amount * GST_RATE) / (1 + GST_RATE));

/** Sales within the seller's state split into CGST + SGST; sales to other states are IGST. */
export function gstLines(gst: number, destinationState: string) {
  if (destinationState !== siteConfig.homeState) {
    return [{ label: "IGST (18%)", amount: gst }];
  }
  const central = round(gst / 2);
  return [
    { label: "CGST (9%)", amount: central },
    { label: "SGST (9%)", amount: round(gst - central) },
  ];
}
