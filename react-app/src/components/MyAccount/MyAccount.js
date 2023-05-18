import { useState } from "react";

import styles from './MyAccount.module.sass';

import NewItem from "../NewItem/NewItem";
import TopBar from "../TopBar/TopBar";
import SlideMenu from "../SlideMenu/SlideMenu";
import BurgerBtn from "../BurgerBtn/BurgerBtn";

const items = [
    {title: 'Title1', text: 'Text1'},
    {title: 'Title2', text: 'Text2'},
    {title: 'Title3', text: 'Text3'},
    {title: 'Title4', text: 'Text4'},
    {title: 'Title5', text: 'Text5'},
    {title: 'Title6', text: 'Text6'},
    {title: 'Title7', text: 'Text7'},
    {title: 'Title8', text: 'Text8'},
];

const MyAccount = () => {

    const [isActive, setIsActive] = useState(false);

    const handleClick = event => {
        setIsActive(current => !current);
    };

    return (
        <div className={styles.container}>
            <BurgerBtn click={handleClick} />

            <SlideMenu isActive={isActive} />

            <div className={styles.head}>
                <div className={styles.userImg}></div>
                <div className={styles.accountName}>
                    Account Name
                </div>
                <div className={styles.nickName}>
                    @nickname
                </div>
            </div>

            <div className={styles.bio}>
                <h3 className={styles.bioTitle}>
                    Bio
                </h3>
                <p className={styles.bioText}>
                    Some text about user
                </p>
            </div>

            <TopBar title='My Apps' />

            <div className={styles.newList}>
                {
                    items.map((item, index) => {
                        return (
                            <NewItem key={index} title={item.title} text={item.text} />
                        )
                    })
                }
            </div>
        </div>
    );
}

export default MyAccount;