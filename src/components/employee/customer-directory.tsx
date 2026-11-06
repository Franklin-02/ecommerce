"use client";

import Link from "next/link";
import { DataTable, type Column, type TableFilter } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import type { Customer, CustomerTier } from "@/types/commerce";

const TIERS: CustomerTier[] = ["Standard", "Plus", "Pro"];

const defaultCity = (customer: Customer) => {
  const address = customer.addresses.find((item) => item.isDefault) ?? customer.addresses[0];
  return address ? `${address.city}, ${address.state}` : "";
};

const columns: Column<Customer>[] = [
  {
    key: "name",
    header: "Customer",
    sortValue: (customer) => customer.name,
    cell: (customer) => (
      <Link href={`/employee/customers/view?id=${customer.id}`} className="font-semibold whitespace-nowrap text-brand-600 hover:text-brand-700">
        {customer.name}
      </Link>
    ),
  },
  { key: "email", header: "Email", hideBelow: "md", sortValue: (customer) => customer.email, cell: (customer) => customer.email },
  { key: "phone", header: "Phone", hideBelow: "lg", cell: (customer) => <span className="whitespace-nowrap">{customer.phone}</span> },
  { key: "city", header: "Location", hideBelow: "lg", sortValue: defaultCity, cell: defaultCity },
  { key: "tier", header: "Tier", sortValue: (customer) => TIERS.indexOf(customer.tier), cell: (customer) => <Badge>{customer.tier}</Badge> },
];

const filters: TableFilter<Customer>[] = [
  {
    key: "tier",
    label: "All tiers",
    options: TIERS.map((tier) => ({ value: tier, label: tier })),
    matches: (customer, value) => customer.tier === value,
  },
];

export function CustomerDirectory({ customers }: { customers: Customer[] }) {
  return (
    <>
      <PageHeader title="Customers" description="Read-only contact details for order support." />
      <DataTable
        rows={customers}
        columns={columns}
        filters={filters}
        getRowKey={(customer) => customer.id}
        label="Customers"
        searchPlaceholder="Search name, email or phone"
        searchText={(customer) => `${customer.name} ${customer.email} ${customer.phone}`}
      />
    </>
  );
}
