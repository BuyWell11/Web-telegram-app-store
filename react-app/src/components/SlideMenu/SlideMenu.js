import styles from './SlideMenu.module.sass';

import { RiAccountCircleLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const SlideMenu = ({isActive}) => {
    return (
        <div className={isActive ? styles.containerOn : styles.containerOff}>
            <nav className={styles.nav}>
                <div className={styles.userProfile}>
                    Profile
                </div>

                <ul className={styles.listGreen}>
                    <li className={styles.item}>
                        <RiAccountCircleLine className={styles.icon} />
                        <Link to={'/user'}>
                            My Account
                        </Link>
                    </li>

                    <li className={styles.item}>
                        <RiAccountCircleLine className={styles.icon} />
                        <Link to={'/'}>
                            Main Page
                        </Link>
                    </li>

                    <li className={styles.item}>
                        <RiAccountCircleLine className={styles.icon} />
                        <Link to={'/'}>
                            All Apps
                        </Link>
                    </li>
                </ul>

                <ul className={styles.listBlue}>
                    <li className={styles.item}>
                        <RiAccountCircleLine className={styles.icon} />
                        <Link to={'/'}>
                            My Apps
                        </Link>
                    </li>

                    <li className={styles.item}>
                        <RiAccountCircleLine className={styles.icon} />
                        <Link to={'/'}>
                            Upload
                        </Link>
                    </li>
                </ul>

                <ul className={styles.listPink}>
                    <li className={styles.item}>
                        <Link to={'/'}>
                            Become A Moderator
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
export default SlideMenu;
