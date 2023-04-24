import Image from "next/image";
import logo from '../images/logo.png';
import Link from "next/link";
import styles from '../styles/navigation.module.css';

export default function Navigation() {
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <section>
                    <Image priority src={logo} alt="" width={100} height={100} />
                </section>
                <section className={styles['section-nav-buttons']}>
                    <ul className={styles['nav-buttons']}>
                        <li><Link className={styles.a} href="/">INICIO</Link></li>
                        <li><Link className={styles.a} href="/tabla/radiografia">RADIOGRAFIAS</Link></li>
                        <li><Link className={styles.a} href="/tabla/ecografia">ECOGRAFIAS</Link></li>
                        <li><Link className={styles.a} href="/todos">TODOS</Link></li>
                        <li><Link className={styles.a} href="/caja">CAJA</Link></li>
                    </ul>
                </section>
            </nav>
        </header>
    )
}