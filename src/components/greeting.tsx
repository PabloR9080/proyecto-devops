import styles from '../styles/styles.module.css'

export default function Greeting({title}){
    return (
        <>
            <h1 className={styles.title +" text-3xl font-bold underline"}>{title ? title : "A cool title here!"}</h1>
        </>
    )
} 