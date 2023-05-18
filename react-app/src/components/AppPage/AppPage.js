import styles from "./AppPage.module.sass";
import {useState} from "react";
import BurgerBtn from "../BurgerBtn/BurgerBtn";
import SlideMenu from "../SlideMenu/SlideMenu";

const AppPage = ({text, title, img, id}) => {

  const [isActive, setIsActive] = useState(false);

  const handleClick = event => {
    setIsActive(current => !current);
  };

  return (
    <div className={styles.container}>
      <BurgerBtn click={handleClick} />

      <SlideMenu isActive={isActive} />

      <div className={styles.head}>
        <div className={styles.headImg}>
          <img src={img} alt=""/>
        </div>

        <h1 className={styles.headTitle}>
          {title}
        </h1>
      </div>

      <div className={styles.info}>
        <h2 className={styles.infoTitle}>
          Info
        </h2>

        <p className={styles.infoDescription}>
          {text}
        </p>
      </div>
    </div>
  );

}

export default AppPage;