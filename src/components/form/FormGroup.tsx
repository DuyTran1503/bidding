import { ReactNode } from "react";

interface IFormGroupProps {
  title: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
}

const FormGroup = ({ title, children, className, required }: IFormGroupProps) => {
  return (
    <div className={`flex flex-col gap-[14px] rounded-xl bg-white p-6 shadow-[0px_4px_30px_0px_rgba(46,45,116,0.05)] ${className}`}>
      <h4 className="text-xl-semibold text-black-500">
        {title}
        {required && <span className="text-red-500"> *</span>}
      </h4>
      {children}
    </div>
  );
};

export default FormGroup;
