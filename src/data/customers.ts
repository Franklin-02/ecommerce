import type { Address, Customer, CustomerTier } from "@/types/commerce";
import { dayKey, pick, seededRandom } from "./seed";

const TN = "Tamil Nadu";

/** Name, city, state, PIN code, area. Mostly Tamil Nadu, with a few out-of-state customers. */
const people: [string, string, string, string, string][] = [
  ["Arun Kumar", "Chennai", TN, "600017", "T. Nagar"],
  ["Priya Subramanian", "Coimbatore", TN, "641002", "R.S. Puram"],
  ["Karthik Rajan", "Madurai", TN, "625020", "Anna Nagar"],
  ["Meena Lakshmi", "Tiruchirappalli", TN, "620018", "Thillai Nagar"],
  ["Mohamed Riyaz", "Chennai", TN, "600041", "Thiruvanmiyur"],
  ["Divya Ramesh", "Salem", TN, "636004", "Fairlands"],
  ["Vignesh Balaji", "Tirunelveli", TN, "627002", "Palayamkottai"],
  ["Jennifer Antony", "Nagercoil", TN, "629001", "Vadasery"],
  ["Harish Natarajan", "Erode", TN, "638001", "Perundurai Road"],
  ["Anitha Krishnan", "Vellore", TN, "632001", "Sathuvachari"],
  ["Saravanan Murugan", "Thoothukudi", TN, "628002", "Millerpuram"],
  ["Deepa Venkatesh", "Thanjavur", TN, "613001", "Medical College Road"],
  ["Ayesha Banu", "Tiruppur", TN, "641604", "Avinashi Road"],
  ["Muthu Selvam", "Dindigul", TN, "624001", "Nagal Nagar"],
  ["Lavanya Iyer", "Chennai", TN, "600004", "Mylapore"],
  ["Prakash Raj", "Hosur", TN, "635109", "Bagalur Road"],
  ["Sangeetha Mani", "Karur", TN, "639001", "Kovai Road"],
  ["Gopal Swamy", "Kanchipuram", TN, "631501", "Gandhi Road"],
  ["Nithya Sekar", "Cuddalore", TN, "607001", "Manjakuppam"],
  ["Rajesh Pandian", "Ooty", TN, "643001", "Charing Cross"],
  ["Kavitha Sundaram", "Coimbatore", TN, "641012", "Gandhipuram"],
  ["Aravind Shankar", "Bengaluru", "Karnataka", "560038", "Indiranagar"],
  ["Shalini Vasan", "Puducherry", "Puducherry", "605001", "White Town"],
  ["Naveen Reddy", "Hyderabad", "Telangana", "500081", "Madhapur"],
];

const streets = ["Gandhi Road", "Nehru Street", "Bharathiyar Street", "Kamarajar Salai", "Periyar Street", "Thiruvalluvar Street", "Anna Salai", "Vivekananda Street"];

const random = seededRandom(4021);

export const customers: Customer[] = people.map(([name, city, state, pincode, area], index) => {
  const id = `cus_${String(index + 1).padStart(3, "0")}`;
  // An obviously sample range, so no real person's number appears in the demo.
  const phone = `+91 90000 ${10001 + index}`;
  const home: Address = {
    id: `${id}_home`,
    label: "Home",
    fullName: name,
    phone,
    line1: `${1 + Math.floor(random() * 240)}, ${pick(random, streets)}`,
    line2: area,
    city,
    state,
    pincode,
    isDefault: true,
  };
  const addresses: Address[] = [home];
  if (index % 3 === 0) {
    addresses.push({
      ...home,
      id: `${id}_work`,
      label: "Work",
      line1: `${1 + Math.floor(random() * 90)}, ${pick(random, streets)}`,
      line2: `Floor ${1 + Math.floor(random() * 6)}, ${area}`,
      isDefault: false,
    });
  }
  const tier: CustomerTier = index % 7 === 0 ? "Pro" : index % 3 === 0 ? "Plus" : "Standard";
  return {
    id,
    name,
    email: `${name.toLowerCase().replace(/[^a-z ]/g, "").replace(" ", ".")}@example.com`,
    phone,
    joinedAt: dayKey(30 + Math.floor(random() * 900)),
    tier,
    status: index === 17 ? "blocked" : "active",
    addresses,
  };
});

/** The account used by the demo login. */
export const demoCustomer = customers[0];
