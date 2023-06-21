import styles from "./page.module.css";
import { Converter } from "./Converter";
import { getExchangeRates } from "@/api";

export default async function Home() {
  const { rates, errorMessage } = await getExchangeRates();

  return (
    <main className={styles.main}>
      {errorMessage ? <div>{errorMessage}</div> : <Converter rates={rates}/>}
    </main>
  );
}
