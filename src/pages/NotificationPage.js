import './NotificationPage.css';
import { Fragment, useEffect, useState } from 'react';
import { getDoc, updateDoc } from 'firebase/firestore';
import Notification from '../components/Notification';

const NotificationPage = (props) => {
  const {
    getNotifications,
    formatTimeShort,
    setUserNotifications,
    notReadNotifications,
    userNotifications,
    setIsNotificationsNotRead,
    setIsNotificationPopUpVisable,
    userData,
    selectedListProfile,
    followHandler,
    unfollowModalHandler,
    isFollowLoading,
  } = props;

  useEffect(() => {
    setIsNotificationsNotRead(false);
    setIsNotificationPopUpVisable(false);
  },[]);

  useEffect(() => {
    if (userData !== undefined) {
      getNotifications();      
    }
  }, [userData]);
 
  return (
    <main className='notifications'>
      <ul className='notifications-list'>
        {userNotifications.map((notification, index) => {
          const {
            notificationID
          } = notification;
          return (
            <Fragment key = {notificationID}>
              <Notification
                index = {index}
                userNotifications = {userNotifications}
                userData = {userData}
                selectedListProfile = {selectedListProfile}
                followHandler = {followHandler}
                unfollowModalHandler = {unfollowModalHandler}
                isFollowLoading = {isFollowLoading}
                notification = {notification}
                formatTimeShort = {formatTimeShort}
              />                
            </Fragment>
          );
        })}       
      </ul>
    </main>
  );
};

export default NotificationPage;