import styles from "../styles/styles.module.css";

export default function Greeting({ className, title }: {className: any, title: string}) {
  return (
    <h1 className={`text-3xl font-bold underline ${className}`}>
      {title ? title : "A cool title here!"}
    </h1>
  );
}
