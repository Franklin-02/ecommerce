"use client";

import { ChevronDown } from "lucide-react";
import {
  createContext,
  useContext,
  useId,
  useState,
  type ComponentProps,
  type FormEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Form system built on native constraint validation. <Form> checks every control
 * in its DOM subtree on submit, however deeply nested, and each field renders its
 * own message in space reserved below it, so errors never shift the layout.
 */
type FormErrors = Record<string, string>;
const FormContext = createContext<FormErrors>({});

type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function messageFor(control: FormControl) {
  const { validity, dataset } = control;
  const label = dataset.label ?? "This field";
  if (validity.valueMissing) return `${label} is required.`;
  if (validity.typeMismatch && control.type === "email") return "Enter a valid email, like name@example.com.";
  if (validity.patternMismatch) return dataset.patternMessage ?? `${label} isn't in the right format.`;
  if (validity.tooShort) return `${label} must be at least ${(control as HTMLInputElement).minLength} characters.`;
  if (validity.rangeUnderflow) return `${label} must be ${(control as HTMLInputElement).min} or more.`;
  if (validity.rangeOverflow) return `${label} must be ${(control as HTMLInputElement).max} or less.`;
  if (validity.customError) return control.validationMessage;
  return control.validationMessage;
}

interface FormProps extends Omit<ComponentProps<"form">, "onSubmit"> {
  /** Called with the form's values once every field is valid. */
  onValid: (values: Record<string, string>, form: HTMLFormElement) => void;
}

export function Form({ onValid, className, children, ...props }: FormProps) {
  const [errors, setErrors] = useState<FormErrors>({});

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const controls = [...form.elements].filter(
      (el): el is FormControl => "willValidate" in el && (el as FormControl).willValidate && Boolean((el as FormControl).name),
    );
    const invalid = controls.filter((control) => !control.validity.valid);
    setErrors(Object.fromEntries(invalid.map((control) => [control.name, messageFor(control)])));
    if (invalid.length > 0) {
      invalid[0].focus();
      return;
    }
    onValid(Object.fromEntries(new FormData(form) as unknown as Iterable<[string, string]>), form);
  };

  const clearFixed = (event: FormEvent<HTMLFormElement>) => {
    const control = event.target as FormControl;
    if (errors[control.name] && control.validity.valid) {
      setErrors((current) => Object.fromEntries(Object.entries(current).filter(([name]) => name !== control.name)));
    }
  };

  return (
    <FormContext.Provider value={errors}>
      <form noValidate onSubmit={onSubmit} onInput={clearFixed} className={cn("grid grid-cols-1 gap-x-4 sm:grid-cols-2", className)} {...props}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

interface FieldShellProps {
  name: string;
  label: string;
  hint?: string;
  full?: boolean;
  children: (control: { id: string; describedBy: string; error?: string }) => ReactNode;
}

function FieldShell({ name, label, hint, full, children }: FieldShellProps) {
  const id = useId();
  const error = useContext(FormContext)[name];
  const describedBy = `${id}-error`;
  return (
    <div className={cn("flex min-w-0 flex-col", full && "sm:col-span-2")}>
      <label htmlFor={id} className="mb-1.5 text-sm font-medium text-ink-800">
        {label}
      </label>
      {children({ id, describedBy, error })}
      <p id={describedBy} className={cn("mt-1 min-h-5 text-[0.8125rem] leading-5", error ? "font-medium text-deal" : "text-ink-500")}>
        {error ?? hint}
      </p>
    </div>
  );
}

const controlClass =
  "h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink-950 transition-colors placeholder:text-ink-400 hover:border-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-surface-muted disabled:text-ink-500 aria-invalid:border-deal";

interface CommonFieldProps {
  name: string;
  label: string;
  hint?: string;
  full?: boolean;
  /** Message shown when `pattern` fails. */
  patternMessage?: string;
}

export function TextField({ name, label, hint, full, patternMessage, className, ...props }: CommonFieldProps & Omit<ComponentProps<"input">, "name">) {
  return (
    <FieldShell name={name} label={label} hint={hint} full={full}>
      {({ id, describedBy, error }) => (
        <input
          id={id}
          name={name}
          data-label={label}
          data-pattern-message={patternMessage}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(controlClass, className)}
          {...props}
        />
      )}
    </FieldShell>
  );
}

export function SelectField({ name, label, hint, full, className, children, ...props }: CommonFieldProps & Omit<ComponentProps<"select">, "name">) {
  return (
    <FieldShell name={name} label={label} hint={hint} full={full}>
      {({ id, describedBy, error }) => (
        <div className="relative">
          <select
            id={id}
            name={name}
            data-label={label}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={cn(controlClass, "appearance-none pr-9", className)}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-500" aria-hidden />
        </div>
      )}
    </FieldShell>
  );
}

export function TextAreaField({ name, label, hint, full = true, className, ...props }: CommonFieldProps & Omit<ComponentProps<"textarea">, "name">) {
  return (
    <FieldShell name={name} label={label} hint={hint} full={full}>
      {({ id, describedBy, error }) => (
        <textarea
          id={id}
          name={name}
          data-label={label}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          rows={3}
          className={cn(controlClass, "h-auto py-2.5", className)}
          {...props}
        />
      )}
    </FieldShell>
  );
}

/** Groups related fields. The legend turns red when any field inside is invalid. */
export function FormSection({ legend, description, children }: { legend: string; description?: string; children: ReactNode }) {
  return (
    <fieldset className="group/section col-span-full grid grid-cols-1 gap-x-4 sm:grid-cols-2">
      <legend className="mb-3 text-base font-semibold text-ink-950 group-has-[[aria-invalid=true]]/section:text-deal">
        {legend}
      </legend>
      {description && <p className="col-span-full -mt-2 mb-3 text-sm text-ink-500">{description}</p>}
      {children}
    </fieldset>
  );
}

export function CheckboxField({ label, className, ...props }: { label: ReactNode } & ComponentProps<"input">) {
  return (
    <label className={cn("flex items-center gap-2.5 text-sm text-ink-800", className)}>
      <input type="checkbox" className="size-4 rounded accent-brand-600" {...props} />
      <span>{label}</span>
    </label>
  );
}
