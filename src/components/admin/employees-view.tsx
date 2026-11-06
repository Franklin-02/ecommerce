"use client";

import { DataTable, type Column } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Form, SelectField, TextField } from "@/components/ui/form";
import { ConfirmDialog, Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/format";
import type { StatusTone } from "@/lib/status";
import { employeesCollection } from "@/stores/admin-data";
import { DEMO_PASSWORD } from "@/stores/auth";
import { newId } from "@/stores/collection";
import { showToast } from "@/stores/toast";
import type { Employee } from "@/types/commerce";
import { AddButton, FormActions, NameCell, RowActions, useCrud } from "./crud";

const ROLES: Employee["role"][] = ["Store Manager", "Fulfillment Lead", "Fulfillment Associate", "Inventory Specialist", "Customer Support", "Marketing Manager"];
const DEPARTMENTS: Employee["department"][] = ["Operations", "Fulfillment", "Inventory", "Support", "Marketing"];

const statusMeta: Record<Employee["status"], { label: string; tone: StatusTone }> = {
  active: { label: "Active", tone: "success" },
  "on-leave": { label: "On leave", tone: "warning" },
  inactive: { label: "Inactive", tone: "neutral" },
};

export function EmployeesView() {
  const employees = employeesCollection.useItems();
  const crud = useCrud<Employee>();

  const adminCount = employees.filter((employee) => employee.access === "admin").length;
  /** The portal must always keep one admin, or nobody could sign in to fix it. */
  const isLastAdmin = (employee: Employee) => employee.access === "admin" && adminCount <= 1;

  const save = (values: Record<string, string>) => {
    const patch = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      role: values.role as Employee["role"],
      department: values.department as Employee["department"],
      status: values.status as Employee["status"],
      shift: values.shift,
      location: values.location,
      access: values.access as Employee["access"],
      password: values.password,
    };
    if (crud.item && isLastAdmin(crud.item) && patch.access !== "admin") {
      patch.access = "admin";
      showToast("Kept admin access: this is the only admin account");
    }
    if (crud.item) {
      employeesCollection.update(crud.item.id, patch);
      showToast(`${patch.name} updated`);
    } else {
      employeesCollection.add({ ...patch, id: newId("emp"), joinedAt: new Date().toISOString().slice(0, 10) });
      showToast(`${patch.name} added`);
    }
    crud.close();
  };

  const columns: Column<Employee>[] = [
    { key: "name", header: "Employee", sortValue: (employee) => employee.name, cell: (employee) => <NameCell name={employee.name} detail={employee.email} /> },
    {
      key: "role",
      header: "Role",
      hideBelow: "md",
      sortValue: (employee) => employee.role,
      cell: (employee) => (
        <span className="whitespace-nowrap">
          {employee.role}
          {employee.access === "admin" ? (
            <span className="ml-1.5 rounded bg-brand-50 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-brand-700">Admin</span>
          ) : null}
        </span>
      ),
    },
    { key: "department", header: "Department", hideBelow: "lg", sortValue: (employee) => employee.department, cell: (employee) => employee.department },
    { key: "location", header: "Location", hideBelow: "lg", sortValue: (employee) => employee.location, cell: (employee) => <span className="whitespace-nowrap">{employee.location}</span> },
    { key: "joined", header: "Joined", hideBelow: "lg", sortValue: (employee) => employee.joinedAt, cell: (employee) => <span className="whitespace-nowrap">{formatDate(employee.joinedAt)}</span> },
    { key: "status", header: "Status", sortValue: (employee) => employee.status, cell: (employee) => <StatusBadge {...statusMeta[employee.status]} /> },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (employee) => (
        <RowActions
          name={employee.name}
          onEdit={() => crud.openEdit(employee)}
          onDelete={() => crud.askDelete(employee)}
          deleteBlocked={isLastAdmin(employee) ? "This is the only admin account." : undefined}
        />
      ),
    },
  ];

  const item = crud.item;

  return (
    <>
      <PageHeader title="Employees" description={`${employees.length} people on the team.`} actions={<AddButton label="Add employee" onClick={crud.openNew} />} />
      <DataTable
        rows={employees}
        columns={columns}
        getRowKey={(employee) => employee.id}
        label="Employees"
        searchPlaceholder="Search name or email"
        searchText={(employee) => `${employee.name} ${employee.email}`}
        filters={[
          {
            key: "department",
            label: "All departments",
            options: DEPARTMENTS.map((department) => ({ value: department, label: department })),
            matches: (employee, value) => employee.department === value,
          },
          {
            key: "status",
            label: "All statuses",
            options: Object.entries(statusMeta).map(([value, meta]) => ({ value, label: meta.label })),
            matches: (employee, value) => employee.status === value,
          },
        ]}
      />

      <Modal open={crud.isOpen} onClose={crud.close} title={item ? "Edit employee" : "Add employee"} size="lg">
        <Form onValid={save}>
          <TextField name="name" label="Full name" required defaultValue={item?.name} autoComplete="off" />
          <TextField name="email" label="Work email" type="email" required defaultValue={item?.email} autoComplete="off" />
          <TextField name="phone" label="Phone" type="tel" required defaultValue={item?.phone} />
          <TextField name="location" label="Location" required defaultValue={item?.location} />
          <SelectField name="role" label="Role" defaultValue={item?.role ?? "Fulfillment Associate"}>
            {ROLES.map((role) => (
              <option key={role}>{role}</option>
            ))}
          </SelectField>
          <SelectField name="department" label="Department" defaultValue={item?.department ?? "Fulfillment"}>
            {DEPARTMENTS.map((department) => (
              <option key={department}>{department}</option>
            ))}
          </SelectField>
          <TextField name="shift" label="Shift" required defaultValue={item?.shift} hint="For example, Mon–Fri, 9am–5pm." />
          <SelectField name="status" label="Status" defaultValue={item?.status ?? "active"}>
            {Object.entries(statusMeta).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </SelectField>
          <SelectField
            name="access"
            label="Portal access"
            defaultValue={item?.access ?? "employee"}
            hint={
              item && isLastAdmin(item)
                ? "The only admin account keeps admin access."
                : "Admins open the admin portal; everyone else the employee portal."
            }
          >
            <option value="employee" disabled={item ? isLastAdmin(item) : false}>
              Employee portal
            </option>
            <option value="admin">Admin portal</option>
          </SelectField>
          <TextField
            name="password"
            label="Portal password"
            required
            minLength={6}
            autoComplete="off"
            defaultValue={item?.password ?? DEMO_PASSWORD}
            hint="They sign in on the login page with their work email and this password."
          />
          <FormActions label={item ? "Save changes" : "Add employee"} onCancel={crud.close} />
        </Form>
      </Modal>

      <ConfirmDialog
        open={crud.deleting !== null}
        title="Remove this employee?"
        body={`${crud.deleting?.name ?? "This employee"} will lose access to the employee portal.`}
        confirmLabel="Remove employee"
        onClose={crud.cancelDelete}
        onConfirm={() => {
          if (!crud.deleting) return;
          employeesCollection.remove(crud.deleting.id);
          showToast(`${crud.deleting.name} removed`);
        }}
      />
    </>
  );
}
