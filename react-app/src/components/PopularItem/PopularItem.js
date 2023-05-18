import styles from './PopularItem.module.sass';
import {Link} from "react-router-dom";

const PopularItem = ({title, img, link}) => {
    return (
        <Link to={link} className={styles.wrap}>
            <div className={styles.img}>
              <img src={img} alt=""/>
            </div>
            <h5 className={styles.title}>{title}</h5>
        </Link>
    )
}

export default PopularItem;