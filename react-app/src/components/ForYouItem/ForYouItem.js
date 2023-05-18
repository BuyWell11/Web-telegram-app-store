import styles from './ForYouItem.module.sass';
import {Link} from "react-router-dom";

const ForYouItem = ({text, title, img, link}) => {
    return (
        <Link to={link} className={styles.wrap}>
            <div className={styles.img}>
              <img src={img} alt=""/>
            </div>
            <p className={styles.text}>{text}</p>
            <h5 className={styles.title}>{title}</h5>
        </Link>
    )
}

export default ForYouItem;