import { AlertCircle, ChevronDown, Inbox, LoaderCircle, Search, X } from 'lucide-react';
import { useEffect, useRef, type ReactNode, type SelectHTMLAttributes } from 'react';

export function PageHeading({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children && <div className="heading-actions">{children}</div>}
    </div>
  );
}

export function Loading({ label = 'Loading records…' }: { label?: string }) {
  return (
    <div className="state" role="status">
      <LoaderCircle className="animate-spin" size={23} />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ message, retry }: { message: string; retry: () => void }) {
  return (
    <div className="state" role="alert">
      <AlertCircle size={24} />
      <p>{message}</p>
      <button className="button" onClick={retry}>
        Try again
      </button>
    </div>
  );
}

export function Empty({ message }: { message: string }) {
  return (
    <div className="state">
      <Inbox size={24} />
      <p>{message}</p>
    </div>
  );
}

export function Status({ value }: { value: string }) {
  return (
    <span className={'status status-' + value.toLowerCase().replaceAll(' ', '-')}>
      <span />
      {value}
    </span>
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="select-wrap">
      <select {...props} />
      <ChevronDown size={15} aria-hidden="true" />
    </div>
  );
}

export function SearchField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="search-field">
      <Search size={17} aria-hidden="true" />
      <input
        type="search"
        aria-label={label}
        placeholder={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function Dialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="dialog-header">
        <h2 id="dialog-title">{title}</h2>
        <button className="icon-button" aria-label="Close dialog" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}

export function DetailList({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="detail-list">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
