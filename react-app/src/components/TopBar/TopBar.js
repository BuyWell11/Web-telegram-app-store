import styles from './TopBar.module.sass';
import { RiArrowRightLine } from 'react-icons/ri';

const TopBar = ({title}) => {
    return (
        <div className={styles.wrap}>
            <h2 className={styles.title}>
                {title}
            </h2>

            <RiArrowRightLine className={styles.icon} />
        </div>
    )
}

export default TopBar;