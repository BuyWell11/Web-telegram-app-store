import styles from './NewItem.module.sass';
import {Link} from "react-router-dom";

const NewItem = ({text, title, img, link}) => {
    return (
        <Link to={link}  className={styles.wrap}>
            <div className={styles.img}>
              <img src={img} alt=""/>
            </div>

            <div className={styles.info}>
                <h5 className={styles.title}>{title}</h5>
                <p className={styles.text}>{text}</p>
            </div>
        </Link>
    )
}

export default NewItem;