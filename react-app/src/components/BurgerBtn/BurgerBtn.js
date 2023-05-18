import styles from './BurgerBtn.module.sass';
import {RiMenuFill} from "react-icons/ri";

const BurgerBtn = ({ click }) => {
    return (
        <div className={styles.container}>
            <button onClick={click} className={styles.burgerBtn}>
                <RiMenuFill className={styles.burgerIcon}/>
            </button>
        </div>

    );
}

export default BurgerBtn;