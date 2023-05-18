import Scrollable from "../../hooks/Scrollable";

import styles from './StoreAppCatalogue.module.sass';

import ForYouItem from "../ForYouItem/ForYouItem";
import PopularItem from "../PopularItem/PopularItem";
import NewItem from "../NewItem/NewItem";
import TopBar from "../TopBar/TopBar";
import {useEffect, useState} from "react";
import BurgerBtn from "../BurgerBtn/BurgerBtn";
import SlideMenu from "../SlideMenu/SlideMenu";

const StoreAppCatalogue = () => {

  const [apps, setApps] = useState([]);
  useEffect(() => {
    fetch('http://91.197.3.57:3000/app/all')
      .then(response => response.json())
      .then(json => setApps(json))
  }, [])

  const [isActive, setIsActive] = useState(false);

  const handleClick = event => {
    setIsActive(current => !current);
  };

  if (apps) {
    return (
      <div className={styles.container}>
        <BurgerBtn click={handleClick} />

        <SlideMenu isActive={isActive} />

        <TopBar title='For You' />

        <Scrollable class={styles.scroll}>
          {
            apps.map(app => {
              return (
                <ForYouItem key={app._id} title={app.Name} text={app.Description} img={app.Icon} link={app.Link} />
              )
            })
          }
        </Scrollable>

        <TopBar title='Popular' />

        <Scrollable class={styles.scroll}>
          {
            apps.map(app => {
              return (
                <PopularItem key={app._id} title={app.Name} text={app.Description} img={app.Icon} link={app.Link} />
              )
            })
          }
        </Scrollable>

        <TopBar title='New' />

        <div className={styles.newList}>
          {
            apps.map(app => {
              return (
                <NewItem key={app._id} title={app.Name} text={app.Description} img={app.Icon} link={app.Link} />
              )
            })
          }
        </div>
      </div>
    )
  }


}

export default StoreAppCatalogue;